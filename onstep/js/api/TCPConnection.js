import {
    Socket
} from 'node:net';

export default class TCPConnection {

    constructor() {
        this.client = new Socket();
        this.data = [];
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
            
            this.client.on('data', (data) => {
                this.data.push(data.tostring());
            });
        });
    }

    sendCommand(command) {
        return new Promise((resolve, reject) => {
            this.data = [];
            if (!this.client) {
                return reject('Not connected!');
            }
            this.once('finish', () => {
                resolve(this.data.concat(''));
            });
            this.client.write(command);
        });
    }

    disconnect() {
        return new Promise((resolve, reject) => {
            if (!this.client) {
                return reject('Not connected!');
            }
            this.client.off('error');
            this.client.off('data');
            this.client.end();
        });
    }
}
