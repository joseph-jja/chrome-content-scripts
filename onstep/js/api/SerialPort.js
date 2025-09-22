import fs from 'node:fs/promises';
import { execFileSync } from'node:child_process';

import DeviceConnection from '#server/api/DeviceConnection.js';
import checkZeroResponse from '#server/data/zeroOneReply.js';

const TIMEOUT = 1500;

export default class SerialPort extends DeviceConnection {

    constructor() {
        super();
        this.baudRate = 9600;
        this.data = '';
        this.endsWithHash = false;
        this.returnsZeroOrOne = false;
    }

    connect(options) {
        return new Promise((resolve, reject) => {
            const {
                usbDevice
            } = options;
            if (!usbDevice) {
                return reject('Invalid tty device!');
            }

            const command = `stty -F ${usbDevice} ${this.baudRate}`;
            try {
                const results = execFileSync(command);
                console.log('Success: ', results);
            } catch(e) {
                console.error('ERROR setting baud rate: ', e);
            }

            fs.open(usbDevice, 'r+').then(fd => {
                this.device = fd;
                this.connected = true;
                this.deviceStream = this.device.createReadStream({ encoding: 'utf8', highWaterMark: 1 });
                this.deviceStream.on('readable', () => {
                    let char = this.deviceStream.read(1);
                    this.data = [];
                    while (char) {
                        this.data.push(char.toString());
                        char = this.deviceStream.read(1);
                    }
                    this.emit('readEnd');
                });
                return resolve('Success');
            }).catch(e => {
                console.log('Error: ', e);
                return reject(e);
            });
        });
    }

    sendCommand(command, returnsData = true) {
        return new Promise((resolve, reject) => {
            this.data = [];
            if (!this.isConnected()) {
                return reject('Not connected!');
            }
            this.endsWithHash = false;
            this.returnsZeroOrOne = false;
            if (returnsData) {
                this.returnsZeroOrOne = checkZeroResponse(command);
                if (!this.returnsZeroOrOne) {
                    this.endsWithHash = true;
                }
            }

            this.device.write(command).then(async res => {
                if (!returnsData) {
                    return resolve('no reply');
                }
                
                const readChar = async () => {
                    return new Promise((resolve) => {
                        this.once('readEnd', () => {
                            return resolve(this.data.join(''));
                        });
                    });
                };

                let result = '';
                let foundEnd = false;
                let currentTime = Date.now();
                const endTime = +currentTime + +TIMEOUT
                while (!foundEnd && currentTime < endTime) {
                    result += await readChar();
                    if (this.endsWithHash) {
                        if (result?.includes('#')) {
                            foundEnd = true;
                        }
                    } else if (result?.length > 0) {
                        foundEnd = true;
                    }
                    currentTime = Date.now();
                }
                console.log('got data ', result);
                return resolve(result);
            }).catch(e => {
                console.log('Error: ', e);
                return reject(e);
            });
        });
    }

    disconnect() {
        return new Promise((resolve, reject) => {
            if (!this.device && !this.isConnected()) {
                return reject('Not connected!');
            }
            this.device.close();
            this.connected = false;
            resolve('Closed');
        });
    }
}
