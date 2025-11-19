import {
    REMOTE_HOST
} from 'js/config.js';

async function request(url) {

    return new Promise((resolve, reject) => {
        fetch(`${REMOTE_HOST}${url}`).then(async response => {
            const data = await response.text();
            resolve(data);
        }).catch(e => {
            reject(e);
        });
    });
}
export function getStarList(authToken, ra, dec) {
    const url = `/listofstars?authToken=${authToken}&ra=${ra}&dec=${dec}`;
    return request(url);
}

export function setupConnection(commandOption) {
    const url = `/setup/?command=${encodeURIComponent(commandOption)}`;
    return request(url);
}

export function sendCommand(command = '') {
    const url = `/command/?command=${encodeURIComponent(command)}`;
    return request(url);
}

export function teardownConnection() {
    return request('/disconnect');
}

export function getCommandList() {
    return request('/commandsList');
}
