import {
    Socket
} from 'node:net';
import { EventEmitter } from 'node:events';

export default class NETConnection extends EventEmitter {

    constructor() {
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
                reject(err);
            });
            
            this.client.on('data', (msg) => {
                const results = msg.toString()
                this.data.push(results);
                if (results.includes('#')) {
                    this.emit('readEnd');
                }
            });
        });
    }

    sendCommand(command) {
        return new Promise((resolve, reject) => {
            this.data = [];
            if (!this.client) {
                return reject('Not connected!');
            }
            this.once('readEnd', () => {
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
            this.isConnected = false;
        });
    }
}
