const fs = require('node:fs');
const {
    contextBridge,
    ipcRenderer
} = require('electron');
const {
    platform
} = require('node:os');

const basedir = process.cwd();

const PLATFORM = platform().toLowerCase();

const CONFIG_KEYS = {};

const CONFIG_JSON = `${basedir}/js/config.json`;
try {
    const configData = fs.readFileSync(CONFIG_JSON);
    const jsonConfigData = JSON.parse(configData);
    Object.keys(jsonConfigData).forEach(item => {
        CONFIG_KEYS[item] = jsonConfigData[item];
    });
} catch(e) {
    console.error('No config found. Some functionality will be disabled!');
    console.error(e?.message);
}

// Exposed protected methods in the render process
contextBridge.exposeInMainWorld(
    // Allowed 'ipcRenderer' methods
    'electron', {
        'operatingSystem': () => {
            return PLATFORM;
        },
        'config': CONFIG_KEYS
    }
);
