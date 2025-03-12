const { contextBridge, ipcRenderer } = require('electron');
const { platform } = require('node:os');

const PLATFORM = platform().toLowerCase();

// Exposed protected methods in the render process
contextBridge.exposeInMainWorld(
    // Allowed 'ipcRenderer' methods
    'electron',
    {
        'operatingSystem': () => { return PLATFORM; }
    }
);

