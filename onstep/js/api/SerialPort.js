import DeviceConnection from '#server/api/DeviceConnection.js';
import checkZeroResponse from '#server/data/zeroOneReply.js';
import checkAsterickResponse from '#server/data/checkAsterickResponse.js';

// so node modules can only use require
import {
    createRequire
} from 'module';
import {
    resolve as pathResolve
} from 'node:path';
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
            this.device = serialcom;
            const openResponseCode = this.device.open(usbDevice, 'B9600');
            if (+openResponseCode === 0) {
                this.connected = true;
                return resolve('Success: ' + openResponseCode);
            } else {
                this.device = undefined;
                return reject('ERROR: ' + openResponseCode);
            }
        });
    }

    sendRecieveCommand(command, hasResponse = true,
        isBinary = false, terminatorCharacter, maxReadLength) {

        return new Promise((resolve, reject) => {

            const writtenByteCount = this.device.write(command);
            if (writtenByteCount <= 0) {
                return reject(writtenByteCount);
            }

            // no response necessary
            if (!hasResponse) {
                // return how much data was written out
                return resolve('no reply');
            }

            try {
                const data = this.device.read(isBinary, terminatorCharacter, maxReadLength);
                return resolve(data);
            } catch (e) {
                return reject(e);
            }
        });
    }

    disconnect() {
        return new Promise((resolve, reject) => {
            if (!this.device && !this.isConnected()) {
                return reject('Not connected!');
            }
            this.device.close();
            this.device = undefined;
            this.connected = false;
            this.connected = false;
            resolve('Closed');
        });
    }
}
