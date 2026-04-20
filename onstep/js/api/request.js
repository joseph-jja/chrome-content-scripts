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
export function getStarList(authToken, ra, dec, latitude, longitude) {
    const url = `/listofstars?authToken=${authToken}&ra=${ra}&dec=${dec}&latitude=${latitude}&longitude=${longitude}`;
    return request(url);
}

export function getKnownStarList(latitude, longitude) {
    const url = `/listofknownstars?latitude=${latitude}&longitude=${longitude}`;
    return request(url);
}

export function setupConnection(commandOption) {
    const url = `/setup/?command=${encodeURIComponent(commandOption)}`;
    return request(url);
}

export function sendCommand(command = '', isBoolean,
    hasResponse, terminatorCharacter, maxReadLength) {

    const url = `/command/?command=${encodeURIComponent(command)}&isBoolean=${isBoolean}&hasResponse=${hasResponse}&terminatorCharacter=${encodeURIComponent(terminatorCharacter)}&maxReadLength=${maxReadLength}`;
    return request(url);
}

export function teardownConnection() {
    return request('/disconnect');
}

export function getCommandList() {
    return request('/commandsList');
}
