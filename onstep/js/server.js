import {
    app,
    BrowserWindow,
    ipcMain,
    Menu
} from 'electron';
import express from 'express';

import WifiConnection from '#server/api/WifiConnection.js';
import { LISTEN_PORT } from '#server/config.js';

const basedir = process.cwd();

const server = express();

const Connection = new WifiConnection();

const menu = Menu.buildFromTemplate([]);
Menu.setApplicationMenu(menu)

const createWindow = () => {
    // define the window as a let so we can null it out later
    let win = new BrowserWindow({
        width: 1024,
        height: 768,
        webPreferences: {
            nodeIntegration: true
        }
    });

    win.loadFile(`${basedir}/pages/index.html`);

    win.on('close', (event) => {
        process.exit(0);
    });

    win.on('closed', () => {
        win = null;
    });

    //win.webContents.openDevTools();
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
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

server.get('/setup', (req, res) => {
    const hostPort = req.query?.command;
    if (hostPort) {
        const [host, port] = hostPort.split(':');
        console.log('Trying to connect');
        /*Connection.connect(host, port).then(resp => {
            console.log('Success to connect');
            res.send('Connected ' + resp);        
        }).catch(e => {        
            console.log('Failed to connect');
            res.send('Connection failed ' + e);
        });
        return;*/    
    }
    res.send(`Connection failed, invalid host and port values ${hostPort}`);
});


server.get('/command', (req, res) => {
    res.send('Hello World!');
});

server.listen(LISTEN_PORT, () => {
    console.log(`Example app listening on port ${LISTEN_PORT}`);
});