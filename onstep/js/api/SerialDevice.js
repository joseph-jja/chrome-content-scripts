import fs from 'node:fs/promises';
import {
    Socket
} from 'node:net';

import SocketConnection from '#server/api/SocketConnection.js';

export default class SerialDevice extends SocketConnection {

    constructor() {
        super();
        this.data = [];
        this.fd = undefined;
    }

    connect(options) {
        return new Promise((resolve, reject) => {
            const {
                usbDevice,
                host,
                port
            } = options;

            if (host && port) {
                this.device = new Socket();
                this.device.connect(port, host, () => {
                    this.connected = true;
                    return resolve('Success');
                });
            } else if (usbDevice) {
                fs.open(usbDevice, 'r+').then(fd => {
                    this.fd = fd;
                    this.socket = new Socket({
                        fd
                    });
                    this.isConnected = true;
                    return resolve('Success');
                }).catch(e => {
                    console.log('Error: ', e);
                    return reject(e);
                });
            } else {
                return reject('Invalid ttyp device!');
            }

            this.device.on('error', (err) => {
                return reject(err);
            });

            this.device.on('data', msg => {
                const results = msg.toString()
                this.data.push(results);
                this.emit('readEnd');
            });
        });
    }
}
