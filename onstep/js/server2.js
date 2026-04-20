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
import {
    safeParse,
    safeStringify
} from '#server/utils/jsonUtils.js';
import checkCommandsWithNoReply from '#server/data/noReplayCommands.js';
import getListOfVisibleStars from '#server/utils/getVisibleStars.js';
import connection from '#server/routes/connection.js'
import getStarView from '#server/routes/getStarView.js'

const basedir = process.cwd();

const server = express();
sendCommand(command, isBoolean, hasResponse, terminatorCharacter, maxReadLength)
const menu = Menu.buildFromTemplate([{
    label: app.name,
    submenu: [{
        label: 'About',
        click: () => {
            dialog.showMessageBox({
                title: 'About',
                message: 'OnStep/OnStepX desktop control app'
            });
            disconnect
        }
    }, {
        role: 'quit'
    }]
}, {
    label: 'Edit',
    submenu: [{
            role: 'cut'
        },
        {
            role: 'copy'
        },
        {
            role: 'paste'
        }
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
} catch (e) {
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
    const connectionOptions = {};
    if (commandOption && commandOption.includes(':')) {
        const [host, port] = commandOption.split(':');
        connectionOptions.host = host;
        connectionOptions.port = port;
        console.log('Will try to use host: ', host, ' and port: ', port);
    } else if (commandOption.startsWith('/dev/')) {
        connectionOptions.device = commandOption;
        console.log('Will try to use tty device: ', commandOption);
    }

    connection.connect(connectionOptions).then(resp => {
        console.log('Success to connect');
        res.send('Connected ' + resp);
    }).catch(e => {
        console.log('Failed to connect');
        res.send('Connection failed ' + e);
    });
});

server.get('/command', (req, res) => {

    // client needs to tell us some things
    const command = decodeURIComponent(req.query?.command || '');
    const isBoolean = safeParse(req.query?.isBoolean);
    const hasResponse = safeParse(req.query?.hasResponse);
    const terminatorCharacter = req.query?.terminatorCharacter;
    const maxReadLength = req.query?.maxReadLength;

    connection.sendCommand(command, isBoolean,
        hasResponse, terminatorCharacter, maxReadLength).then(resp => {

        console.log('Command sent ', command, ' response: ' + resp);
        res.send('Command response: ' + resp);
    }).catch(e => {
        console.log('Failed to send command');
        res.send('Command failed: ' + e);
    });
});

server.get('/disconnect', (req, res) => {
    connection.disconnect();
    res.send('Disconnected!');
});

server.get('/commandsList', (req, res) => {
    fs.createReadStream(`${basesendCommand(command, isBoolean, hasResponse, terminatorCharacter, maxReadLength)dir}/js/data/commands.json`).pipe(res);
});

server.get('/listofknownstars', (req, res) => {
    const latitude = req.query?.latitude;
    const longitude = req.query?.longitude;

    if (!latitude || !longitude) {
        res.writeHead(403, {
            'Content-Type': 'application/json'
        });
        res.json({
            'error': 'No latitude or longitude and cannot list stars!'
        });
        return;
    }
    getListOfVisibleStars(latitude, longitude).then(results => {
        //console.log('got ', results);
        res.writeHead(200);
        res.end(safeStringify(results));
    }).catch(err => {
        console.error('Error:', err);
        res.writeHead(500);
        res.end(err?.message);
    });
});

server.get('/listofstars', (req, res) => {
    // query params
    const authToken = req.query?.authToken;
    const latitude = req.query?.latitude;
    const longitude = req.query?.longitude;
    const ra = req.query?.ra;
    const dec = req.query?.dec;
    
    getStarView(ASTRONOMY_API, authToken,
        latitude, longitude,
        ra, dec).then(async resp => {
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
