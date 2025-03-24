import {
    Socket
} from 'node:net';

import DeviceConnection from '#server/api/DeviceConnection.js';

export default class SocketConnection extends DeviceConnection {

    constructor() {
        super();
        this.client = new Socket();
        this.data = [];
        this.isConnected = false;
    }

    connect(host, port) {
        return new Promise((resolve, reject) => {
            if (!host || !port) {
                return reject('Invalid host and or port!');
            }

            this.client.connect(port, host, () => {
                this.isConnected = true;
                return resolve('Success');
            });

            this.client.on('error', (err) => {
                return reject(err);
            });

            this.client.on('data', msg => {
                const results = msg.toString()
                this.data.push(results);
                this.emit('readEnd');
            });
    }
    
    isConnected() {
        return this.isConnected;
    }
    
    sendCommand(command, returnsData = true) {
        return new Promise((resolve, reject) => {
            this.data = [];
            if (!this.client) {
                return reject('Not connected!');
            }

            this.once('readEnd', () => {
                return resolve(this.data.join(''));
            });
            this.client.write(command);
            if (!returnsData) {
                this.removeAllListeners('readEnd');
                return resolve('no reply');
            }
        });
    }

    disconnect() {
        return new Promise((resolve, reject) => {
            if (!this.client && isConnected()) {
                return reject('Not connected!');
            }
            this.client.removeAllListeners('error');
            this.client.removeAllListeners('data');
            this.client.end();
            this.isConnected = false;
            return resolve('Closed');
        });
    }
}
