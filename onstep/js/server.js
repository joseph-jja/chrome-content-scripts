import fs from 'node:fs';

import {
    app,
    BrowserWindow,
    dialog,
    ipcMain,
    Menu
} from 'electron';
import express from 'express';

import SerialPort from '#server/api/SerialPort.js';
import SocketConnection from '#server/api/SocketConnection.js';
import {
    LISTEN_PORT,
    ASTRONOMY_API
} from '#server/config.js';

import COMMANDS_WITH_NO_REPLY from '#server/data/noReplayCommands.js';

const basedir = process.cwd();

const server = express();

let Connection;

const menu = Menu.buildFromTemplate([{
    label: app.name,
    submenu: [{
        label: 'About',
        click: () => {
            dialog.showMessageBox({
                title: 'About',
                message: 'OnStep/OnStepX desktop control app'
            });
        }
    }, {
        role: 'quit'
    }]
}, {
    label: 'Edit',
    submenu: [
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' }
    ]
}]);
Menu.setApplicationMenu(menu);

const args = process.argv;
let enableDebug = false;
args.forEach(arg => {
    if (arg === '--enableDebug') {
        enableDebug = true;
    }
});

const CONFIG_DATA = {};

const CONFIG_JSON = `${basedir}/js/config.json`;
try {
    const configData = fs.readFileSync(CONFIG_JSON);
    const jsonConfigData = JSON.parse(configData);
    Object.keys(jsonConfigData).forEach(item => {
        if (item !== 'ApplicationID' && item !== 'SecretID') {
            CONFIG_DATA[item] = jsonConfigData[item];
        }
    });
} catch(e) {
    console.error('No config found. Some functionality will be disabled!');
    console.error(e?.message);
}

const createWindow = () => {
    // define the window as a let so we can null it out later
    let win = new BrowserWindow({
        width: 1024,
        height: 768,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: `${basedir}/js/preload.js`
        }
    });

    win.loadFile(`${basedir}/pages/index.html`);

    win.on('close', (event) => {
        process.exit(0);
    });

    win.on('closed', () => {
        win = null;
    });

    if (enableDebug) {
        win.webContents.openDevTools();
    }
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });

});

ipcMain.on('close', () => {
    app.quit();
});

app.on('window-all-closed', () => {
    if (Connection?.isConnected()) {
        Connection.disconnect();
    }
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

server.get('/setup', (req, res) => {
    const commandOption = req.query?.command;
    if (commandOption && commandOption.includes(':')) {
        const [host, port] = commandOption.split(':');
        console.log('Trying to connect');
        Connection = new SocketConnection();
        Connection.connect({
            host: host,
            port: port
        }).then(resp => {
            console.log('Success to connect');
            res.send('Connected ' + resp);
        }).catch(e => {
            console.log('Failed to connect');
            res.send('Connection failed ' + e);
        });
        return;
    } else if (commandOption.startsWith('/dev/')) {
        console.log('Trying to connect to tty device');
        Connection = new SerialPort();
        Connection.connect({
            usbDevice: commandOption
        }).then(resp => {
            console.log('Success to connect');
            res.send('Connected ' + resp);
        }).catch(e => {
            console.log('Failed to connect');
            res.send('Connection failed ' + e);
        });
        return;
    }
    res.send(`Connection failed, invalid host and port values ${commandOption}`);
});

const checkNoReply = command => {
    const results = COMMANDS_WITH_NO_REPLY.find(item => {

        return command.startsWith(item);
    });
    return (results?.length > 0);
};

server.get('/command', (req, res) => {
    const command = req.query?.command;
    // values NOT in this array then 
    const returnsData = !checkNoReply(command);
    if (Connection?.isConnected() && command) {
        const decodedCommand = decodeURIComponent(command);
        if (decodedCommand.startsWith(':') && decodedCommand.endsWith('#')) {
            const expectResponse = (typeof returnsData === 'boolean' ? returnsData : true);
            console.log('Should be returning data? ', returnsData, expectResponse);
            Connection.sendCommand(decodedCommand, expectResponse).then(resp => {
                console.log('Command sent ', decodedCommand, ' response: ' + resp);
                res.send('Command response: ' + resp);
            }).catch(e => {
                console.log('Failed to send command');
                res.send('Command failed: ' + e);
            });
            return;
        }
    }
    //console.log('Not connected, no command or invalid command sent!');
    res.send('Not connected, no command or invalid command sent!');
});

server.get('/disconnect', (req, res) => {
    if (Connection?.isConnected()) {
        Connection.disconnect();
        Connection = null;
    }
    res.send('Disconnected!');
});

server.get('/commandsList', (req, res) => {
    fs.createReadStream(`${basedir}/js/data/commands.json`).pipe(res);
});

server.get('/listofstars', (req, res) => {
    const authToken = req.query?.authToken;
    if (!authToken) {
        res.writeHead(403, {
            'Content-Type': 'application/json'
        });
        res.json({
           'error': 'No configuration found for astronomy api' 
        });
        return;
    }
    
    const ra = req.query?.ra;
    const dec = req.query?.dec;
    if (!ra || !dec) {
        res.writeHead(403, {
            'Content-Type': 'application/json'
        });
        res.json({
           'error': 'No right ascension or declination passed' 
        });
        return;
    }
        
    const params = `ra=${ra}&dec=${dec}&limit=5`;
    
    const options = {
        method: 'GET',
        headers: {
            Authorization: `Basic ${authToken}`
        }
    };

    fetch(`${ASTRONOMY_API}/api/v2/search?${params}`, options).then(async resp => {
        const results = await resp.text();
        res.writeHead(200);
        res.end(results);
        //console.log('Success ', results);
    }).catch(e => {
        res.writeHead(500);
        res.end(e);
        //console.log('Failed ', e);
    });
});

server.listen(LISTEN_PORT, () => {
    console.log(`Example app listening on port ${LISTEN_PORT}`);
});
