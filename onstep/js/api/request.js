import {
    REMOTE_HOST
} from 'js/config.js';

async function request(url, command = '', returnsData = true) {

    return new Promise((resolve, reject) => {
        fetch(`${REMOTE_HOST}/${url}?command=${encodeURIComponent(command)}&returnsData=${returnsData}`).then(async response => {
            const data = await response.text();
            resolve(data);
        }).catch(e => {
            reject(e);
        });
    });
}

export function setupConnection(hostPort) {
    return request('setup', hostPort);
}

export function sendCommand(command) {
    return request('command', command);
}

export function teardownConnection() {
    return request('disconnect');
}
