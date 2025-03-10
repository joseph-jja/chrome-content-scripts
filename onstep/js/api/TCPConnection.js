import {
    Socket
} from 'node:net';

export default class TCPConnection {

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
            
            this.client.on('error', (err) => {
                reject(err);
            });
        });
    }

    sendCommand(command) {
        return new Promise((resolve, reject) => {
            if (!this.client) {
                return reject('Not connected!');
            }

            this.client.once('data', (data) => {

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
