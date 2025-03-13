import fs from 'node:fs/promises';
import {
    EventEmitter
} from 'node:events';

export default class SerialPort extends EventEmitter {

    constructor() {
        super();
        this.socket = undefined;
        this.data = [];
        this.isConnected = false;
    }

    connect(ttyDevice) {
        return new Promise((resolve, reject) => {
            if (!ttyDevice) {
                return reject('Invalid ttyp device!');
            }

            fs.open(ttyDevice, 'r+').then(fd => {
                this.socket = fd;
                this.isConnected = true;
                return resolve('Success');
            }).catch(e => {
                console.log('Error: ', e);
                return reject(e);
            });
        });
    }

    sendCommand(command) {
        return new Promise((resolve, reject) => {
            this.data = [];
            if (!this.socket && !this.isConnected) {
                return reject('Not connected!');
            }

            this.socket.write(command).then(async res => {
                const data = await this.socket.read();
                const buffer = new Int8Array(data?.buffer);
                let result = '',
                    i = 0,
                    end = buffer?.length || 0;
                while (!result.includes('#') && i < end) {
                    const charData = String.fromCharCode(buffer[i]);
                    //console.log(charData, charData.length);
                    result += charData;
                    i++;
                }
                //console.log('got data ', result); 
                return resolve(result);
            }).catch(e => {
                console.log('Error: ', e);
                return reject(e);
            });
        });
    }

    disconnect() {
        return new Promise((resolve, reject) => {
            if (!this.socket) {
                return reject('Not connected!');
            }
            this.socket.close();
            this.isConnected = false;
            resolve('Closed');
        });
    }
}

