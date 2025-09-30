import DeviceConnection from '#server/api/DeviceConnection.js';
import checkZeroResponse from '#server/data/zeroOneReply.js';

// so node modules can only use require
import { createRequire } from 'module';
import { resolve as pathResolve } from 'node:path';
const require = createRequire(import.meta.url);

const basedir = process.cwd();
const serialcom = require(`${basedir}/serialcom/build/Release/serialcom.node`);

const TIMEOUT = 1500;

export default class SerialPort extends DeviceConnection {

    constructor() {
        super();
        this.baudRate = 9600;
    }

    connect(options) {
        return new Promise((resolve, reject) => {
            const {
                usbDevice
            } = options;
            if (!usbDevice) {
                return reject('Invalid tty device!');
            }

            // sync code
            const openResponseCode = serialcom.open(usbDevice, 'B9600');
            if (+openResponseCode === 0) {
                return resolve('Success: ' + openResponseCode);
            } else {
                return reject('ERROR: ' + openResponseCode);
            }
        });
    }

    sendCommand(command, returnsData = true) {
        return new Promise((resolve, reject) => {

            const returnsZeroOrOne = returnsData ? checkZeroResponse(command) false;
            const endsWithHash  = returnsData && !returnsZeroOrOne ? '#' : false;
            
            // we can write data at any time;
            const writeReturnCode = serialcom.write(command);
            if (+writeReturnCode === 0) {
                if (!returnsData) {
                    return resolve('no reply');
                }
                const readData = serialcom.read(returnsZeroOrOne, endsWithHash);
                resolve(readData);
                
            } else {
                reject('ERROR: writing data returned ' + writeReturnCode);
            }
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
