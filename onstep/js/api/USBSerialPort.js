import {
    EventEmitter
} from 'node:events';

import { SerialPort } from 'serialport'

import PromiseWrapper from '#server/utils/PromiseWrapper.js';

export default class USBSerialPort extends EventEmitter {

    constructor() {
        super();
        this.usbPort = undefined;
        this.data = [];
        this.isConnected = false;
    }

    connect(ttyDevice) {
        return new Promise(async (resolve, reject) => {
            if (!ttyDevice) {
                return reject('Invalid ttyp device!');
            }

            try {
                this.usbPort = new SerialPort({ path: ttyDevice, baudRate: 9600 });
                this.isConnected = true;
                console.log('Connected');
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
            if (!this.usbPort && !this.isConnected) {
                return reject('Not connected!');
            }

            try {
                const bytes = this.usbPort.write(command);
                console.log('Data writen', bytes, command);
            } catch(err) {
                console.log('Error: ', err);
                return reject(err);
            }
            console.log('Expected to return data? ', returnsData);
            if (!returnsData) {
                return resolve('no reply');
            }
            const dataBuffer = Buffer.alloc(100)
            await this.usbPort.read(dataBuffer, 0, 100);
            
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
            console.log('Results from read ', result, buffer.length); 
            return resolve(result);
        });
    }

    disconnect() {
        return new Promise((resolve, reject) => {
            if (!this.usbPort || !this.isConnected) {
                return reject('Not connected!');
            }
            this.usbPort.close();
            this.isConnected = false;
            resolve('Closed');
        });
    }
}

