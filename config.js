const fs = require('fs');
const path = require('path');
const uuidv4 = require('uuid').v4;

const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
}

const randomString = (length=20) => {
    let result           = '';
    const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const debugUUID = uuidv4();

const configTemplate = (port=3001, minruntime=300, debug=false, baseURL = "http://localhost:3001/v1/", enableRemove = true) => `{
    "pepper" : "${randomString(50)}",
    "encToken" : "${randomString(50)}",
    "port": ${port},
    "ErrorCodes": {
        "UserNotFound": "${uuidv4()}",
        "PasswordWrong": "${uuidv4()}"
    },
    "minRuntime": ${minruntime},
    "DEBUG": ${debug},
    "DEBUGVALUES": {
        "uuidv4": "${debugUUID}"
    },
    "baseURL": "${baseURL}",
    "enableRemoveBE": ${enableRemove}
}`;

const clientConfigTemplate = (debug=false, baseURL = "http://localhost:3001/v1/", enableRemove = true, language = "en") => `{
    "DEBUG": ${debug},
    "DEBUGVALUES": {
        "uuidv4": "${debugUUID}"
    },
    "baseURL": "${baseURL}",
    "enableRemoveFE": ${enableRemove},
    "language": "${language}"
}`;

const configPath = './config.json';
const dbPath = './server/db/';
const clientconfig = './client/src/config.json';

const myargs = process.argv.slice(2);

const dateformat = () => {
    const d = new Date();
    const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
    const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
    const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
    return `${ye}-${mo}-${da}`;
}

try {
    if(myargs.indexOf("--help") > -1 || myargs.length === 0) {
        console.log(`
        \t --backupconfig  \n
        \t\t backups the main config file \n
        \t --newconfig  \n
        \t\t creates a new main config file \n
        \t --deleteDBs \n
        \t\t deletes the database file \n
        \t --clientconfig \n
        \t\t creates a new client/frontend config file \n
        \n\n
        -port [value] \n
        -minruntime [value in ms] \n
        -debug [true/false] \n
        -enableRemoveFE [true/false] \n
        \t enables if the remove Form is shown \n
        -enableRemoveBE [true/false] \n
        \t enables if the remove Backend exists \n
        -baseURL [URL of Backend] \n
        -language [en/de/...] \n
        -overrideconfig
        \t if set, overrides the main config file \n
        `);
        return ;
    }

    if(myargs.indexOf("--backupconfig") > -1) {
        fs.copyFile(configPath, `config-${dateformat()}-${getRandomInt(Number.MAX_SAFE_INTEGER)}.json`, (err) => {
            if (err) throw err;
            console.log('config was backupped');
        });
    }

    if(myargs.indexOf("--newconfig") > -1) {
        if (fs.existsSync(configPath) && myargs.indexOf("-overrideconfig") === -1) {
            console.log('config was not changed');
        } else {
            const port = myargs.indexOf("-port") > -1 ? parseInt(myargs[myargs.indexOf("-port")+1]) : 3001;
            const minruntime = myargs.indexOf("-minruntime") > -1 ? parseInt(myargs[myargs.indexOf("-minruntime")+1]) : 300;
            const debug = myargs.indexOf("-debug") > -1 ? myargs[myargs.indexOf("-debug")+1] === "true" : true;
            const baseURL = myargs.indexOf("-baseURL") > -1 ? myargs[myargs.indexOf("-baseURL")+1] : "http://localhost:3001/v1/";
            const enableRemoveBE = myargs.indexOf("-enableRemoveBE") > -1 ? myargs[myargs.indexOf("-enableRemoveBE")+1] === "true" : false;

            fs.writeFile(configPath, configTemplate(port, minruntime, debug, baseURL, enableRemoveBE), function (err) {
                if (err) throw err;
            });
            console.log('new config was created');
        }
    }

    if(myargs.indexOf("--deleteDBs") > -1) {
        fs.readdir(dbPath, (err, files) => {
            if (err) throw err;
          
            for (const file of files) {
              fs.unlink(path.join(dbPath, file), err => {
                if (err) throw err;
              });
            }
        });
        console.log('database directory was cleaned');
    }

    if(myargs.indexOf("--clientconfig") > -1) {
        if(fs.existsSync(clientconfig)) {
            fs.unlink(clientconfig, err => {
                if (err) throw err;
            });
            console.log('old Client-Config was deleted');
        }
        const debug = myargs.indexOf("-debug") > -1 ? myargs[myargs.indexOf("-debug")+1] === "true" : true;
        const baseURL = myargs.indexOf("-baseURL") > -1 ? myargs[myargs.indexOf("-baseURL")+1] : "http://localhost:3001/v1/";
        const enableRemoveFE = myargs.indexOf("-enableRemoveFE") > -1 ? myargs[myargs.indexOf("-enableRemoveFE")+1] === "true" : false;
        const language = myargs.indexOf("-language") > -1 ? myargs[myargs.indexOf("-language")+1] : "en";

        fs.writeFile(clientconfig, clientConfigTemplate(debug, baseURL, enableRemoveFE, language), function (err) {
            if (err) throw err;
        });
        console.log('new client-config was created');
    }

} catch(err) {
  console.error(err)
}
