import {
    app,
    BrowserWindow,
    ipcMain,
    Menu
} from 'electron';
import express from 'express';

//import SerialPort from '#server/api/SerialPort.js';
import SocketConnection from '#server/api/SocketConnection.js';
import {
    LISTEN_PORT
} from '#server/config.js';

const basedir = process.cwd();

const server = express();

const Connection = new SocketConnection();

const menu = Menu.buildFromTemplate([]);
Menu.setApplicationMenu(menu)

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
    if (Connection.isConnected) {
        Connection.disconnect();
    }
    if (process.platform !== 'darwin') {    
        app.quit();
    }
});

server.get('/setup', (req, res) => {
    const hostPort = req.query?.command;
    if (hostPort) {
        const [host, port] = hostPort.split(':');
        console.log('Trying to connect');
        Connection.connect(host, port).then(resp => {
            console.log('Success to connect');
            res.send('Connected ' + resp);
        }).catch(e => {
            console.log('Failed to connect');
            res.send('Connection failed ' + e);
        });
        return;
    } else if (hostPort.startsWith('/dev/')) {
          console.log('Trying to connect to tty device');
          //Connection.connectDevice(hostPort).then(resp => {
          //    console.log('Success to connect');
          //    res.send('Connected ' + resp);
          //}).catch(e => {
          //    console.log('Failed to connect');
              res.send('Connection failed ');// + e);
          //});
    }
    res.send(`Connection failed, invalid host and port values ${hostPort}`);
});

server.get('/command', (req, res) => {
    const command = req.query?.command;
    if (Connection.isConnected && command) {
        if (command.startsWith(':') && command.endsWith('#')) {
            Connection.sendCommand(command).then(resp => {
                console.log('Command response: ' + resp);
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
    if (Connection.isConnected) {
        Connection.disconnect();
    }
    res.send('Disconnected!');
});

server.listen(LISTEN_PORT, () => {
    console.log(`Example app listening on port ${LISTEN_PORT}`);
});
