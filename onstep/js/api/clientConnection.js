import {
    REMOTE_HOST
} from 'js/config.js';

async function sendCommand(url, command) {

    return new Promise((resolve, reject) => {
        fetch(`{REMOTE_HOST}/${url}?command=${command}`).then(async response => {
            const data = await response.text();
            resolve(data);
        }).catch(e => {
            reject(e);
        });
    });
}