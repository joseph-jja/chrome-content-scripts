import fs from 'node:fs';

import {
    app,
    BrowserWindow,
    ipcMain,
    Menu
} from 'electron';
import express from 'express';

import SerialPort from '#server/api/SerialPort.js';
import SocketConnection from '#server/api/SocketConnection.js';
import {
    LISTEN_PORT
} from '#server/config.js';

const basedir = process.cwd();

const server = express();

let Connection;

const menu = Menu.buildFromTemplate([]);
Menu.setApplicationMenu(menu);

const args = process.argv;
let enableDebug = false;
args.forEach(arg => {
    if (arg === '--enableDebug') {
        enableDebug = true;   
    }
});

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
    if (Connection?.isConnected) {
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
        Connection.connect(host, port).then(resp => {
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
          Connection.connect(commandOption).then(resp => {
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

server.get('/command', (req, res) => {
    const command = req.query?.command;
    const returnsData = req.query?.returnsData || true;
    if (Connection?.isConnected && command) {
        const decodedCommand = decodeURIComponent(command); 
        if (decodedCommand.startsWith(':') && decodedCommand.endsWith('#')) {
            Connection.sendCommand(decodedCommand, returnsData).then(resp => {
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
    if (Connection?.isConnected) {
        Connection.disconnect();
        Connection = null;
    }
    res.send('Disconnected!');
});

server.get('/commandsList', (req, res) => {
    fs.createReadStream(`${basedir}/js/data/commands.json`).pipe(res);
})

server.listen(LISTEN_PORT, () => {
    console.log(`Example app listening on port ${LISTEN_PORT}`);
});
