import {
    EventEmitter
} from 'node:events';

import { SerialPort } from 'serialport'

import PromiseWrapper from '#server/utils/PromiseWrapper.js';

export default class USBSerialPort extends EventEmitter {

    constructor() {
        super();
        this.fileDescriptor = undefined;
        this.data = [];
        this.isConnected = false;
    }

    connect(ttyDevice) {
        return new Promise(async (resolve, reject) => {
            if (!ttyDevice) {
                return reject('Invalid ttyp device!');
            }

            try {
                this.fileDescriptor = new SerialPort({ path: ttyDevice, baudRate: 9600 });
                this.isConnected = true;
                return resolve('Success');
            } catch (err) {
                console.log('Error: ', err);
                return reject(err);
            }
        });
    }

    sendCommand(command, returnsData = true) {
        return new Promise(async (resolve, reject) => {
            this.data = [];
            if (!this.fileDescriptor && !this.isConnected) {
                return reject('Not connected!');
            }

            try {
                const bytes = this.fileDescriptor.write(command);
                console.log('Data writen', bytes);
            } catch(err) {
                console.log('Error: ', err);
                return reject(err);
            }
            if (!returnsData) {
                return resolve('no reply');
            }
            console.log('returns data? ', returnsData);
            const dataBuffer = Buffer.alloc(100)
            await this.fileDescriptor.read(dataBuffer, 0, 100);
            
            const buffer = new Int8Array(dataBuffer);
            let result = '',
                i = 0,
                end = buffer?.length || 0;
            while (!result.includes('#') && i < end) {
                const charData = String.fromCharCode(buffer[i]);
                const charCode = charData.charCodeAt(0); 
                if (charCode > 32 && charCode < 127) {
                    //console.log('-', charData, '-', charCode);
                    result += charData;
                }
                i++;
            }
            console.log('got data ', result); 
            return resolve(result);
        });
    }

    disconnect() {
        return new Promise((resolve, reject) => {
            if (!this.fileDescriptor || !this.isConnected) {
                return reject('Not connected!');
            }
            this.fileDescriptor.close();
            this.isConnected = false;
            resolve('Closed');
        });
    }
}

