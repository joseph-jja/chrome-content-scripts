import fs from 'node:fs/promises';

import DeviceConnection from '#server/api/DeviceConnection.js';
import checkZeroResponse from '#server/data/zeroOneReply.js';

const TIMEOUT = 2500;

export default class SerialPort extends DeviceConnection {

    constructor() {
        super();
        this.data = [];
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

            fs.open(usbDevice, 'r+').then(fd => {
                this.device = fd;
                this.connected = true;
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
                let result = '';
                let foundEnd = false;
                let currentTime = Date.now();
                const endTime = +currentTime + +TIMEOUT
                while (!foundEnd && currentTime < endTime) {
                    const data = await this.device.read();
                    const buffer = data ? new Int8Array(data.buffer) : undefined;
                    const end = buffer?.length || 0;
                    let i = 0;
                    while (i < end) {
                        if (buffer[i]) {
                            const charData = String.fromCharCode(buffer[i]);
                            const charCode = charData.charCodeAt(0);
                            if (charCode > 32 && charCode < 127) {
                                //console.log('-', charData, '-', charCode);
                                result += charData;
                            }
                        }
                        i++;
                    }
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