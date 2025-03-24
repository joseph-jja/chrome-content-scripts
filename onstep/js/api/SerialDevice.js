import fs from 'node:fs/promises';
import {
    Socket
} from 'node:net';

import SocketConnection from '#server/api/SocketConnection.js';

export default class SerialPort extends SocketConnection {

    constructor() {
        super();
        this.data = [];
    }

    connect(options) {
        return new Promise((resolve, reject) => {
            const {
                usbDevice
            } = options;
            if (!ttyDevice) {
                return reject('Invalid ttyp device!');
            }

            fs.open(ttyDevice, 'r+').then(fd => {
                this.socket = new Socket({ fd });
                this.isConnected = true;
                return resolve('Success');
            }).catch(e => {
                console.log('Error: ', e);
                return reject(e);
            });
        });
    }
}

