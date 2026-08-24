import {
    Socket
} from 'node:net';

import DeviceConnection from '#server/api/DeviceConnection.js';

// how long to try reading
const MAX_READ_COUNT = 60;
const READ_SLEEP_DELAY = 10;
const TOTAL_READ_TRY_TIME = MAX_READ_COUNT * READ_SLEEP_DELAY * 1000;

export default class SocketConnection extends DeviceConnection {

    #terminatorCharacter = undefined;
    #maxReadLength = undefined;
    #isBinary = false;

    #readLimitMaxCount = 10;
    #readCount = 0;

    #readTimeLimit = 2000;

    constructor() {
        super();
        this.data = [];
    }

    setReadTimeLimit(limit) {
        if (!isNaN(limit) || limit <= 0) { 
            return;
        }
        this#readTimeLimit = limit;
    }

    connect(options) {
        return new Promise((resolve, reject) => {
            const {
                host,
                port
            } = options;
            if (!host || !port) {
                return reject('Invalid host and or port!');
            }
            this.device = new Socket();
            this.device.connect(port, host, () => {
                this.connected = true;
                return resolve('Success');
            });

            this.device.on('error', (err) => {
                this.emit('readEnd', err);
            });

            this.device.on('data', msg => {
                const results = msg.toString();
                const readLimitExceeded = this.#readCount > this.#readLimitMaxCount;
                this.#readCount++;
                if (results.trim().length < 0) {
                    console.log('No data!');
                    if (readLimitExceeded) {
                        this.emit('readEnd', new Error('Read count limit exceeded!'));
                    }
                    return;
                }
                
                this.data.push(results);

                const cdata = this.data.join('').trim();

                if (this.#isBinary && cdata.length > 0) {
                    this.emit('readEnd');
                } else if (this.#terminatorCharacter && cdata.includes(this.#terminatorCharacter)) {
                    this.emit('readEnd');
                } else if (this.#maxReadLength && Number.isInteger(this.#maxReadLength) && cdata.length >= this.#maxReadLength) {
                    this.emit('readEnd');
                } else if (readLimitExceeded) {
                    this.emit('readEnd', new Error('Read count limit exceeded!'));
                }
            });
        });
    }

    sendRecieveCommand(command, hasResponse = false,
        isBinary = false, terminatorCharacter, maxReadLength) {

        return new Promise((resolve, reject) => {
            this.data = [];
            if (!this.device) {
                return reject('Not connected!');
            }

            this.#isBinary = isBinary;

            this.#terminatorCharacter = terminatorCharacter;

            this.#maxReadLength = maxReadLength;

            console.log(`Command: ${command} Binary: ${this.#isBinary} Has Response: ${hasResponse} Termination Character: ${this.#terminatorCharacter}.`);

            if (hasResponse) {
                this.#readCount = 0;
                let timerId = -1;
                const handler = (msg) => {
                    if (timerId > -1) {
                        clearTimeout(timerId);
                    }
                    if (msg) { 
                        return reject(msg);
                    }
                    return resolve(this.data.join(''));
                };
                this.once('readEnd', handler);
                timerId = setTimeout(() => {
                    this.off('readEnd', handler);
                    return resolve(this.data.join(''));
                }, this#readTimeLimit);
            }

            this.device.write(command);
            if (!hasResponse) {
                return resolve('no reply');
            }
        });
    }

    disconnect() {
        return new Promise((resolve, reject) => {
            if (!this.device || this.isConnected()) {
                return reject('Not connected!');
            }
            this.device.removeAllListeners('error');
            this.device.removeAllListeners('data');
            this.device.end();
            this.connected = false;
            return resolve('Closed');
        });
    }
}
