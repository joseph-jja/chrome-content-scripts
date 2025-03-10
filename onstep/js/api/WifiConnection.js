import {
    Socket
} from 'node:net';

export default class WifiConnection {

    constructor() {
        this.client = new Socket();
    }

    connect(host, port) {
        return new Promise((resolve, reject) => {
            if (!host || !port) {
                return reject('Invalid host and or port!');
            }
           
            this.client.connect(port, host, () => {
                return resolve('Success');
            });
        });
    }

    sendCommand(command) {
        return new Promise((resolve, reject) => {
            if (!this.client) {
                return reject('Not connected!');
            }
            this.client.once('error', (err) => {
                this.client.off('data');
                reject(err);
            });

            this.client.once('data', (data) => {
                this.client.off('error');
                resolve(data);
            });
            this.client.write(command);
        });
    }

    disconnect() {
        return new Promise((resolve, reject) => {
            if (!this.client) {
                return reject('Not connected!');
            }
            this.client.end();
        });
    }
}
