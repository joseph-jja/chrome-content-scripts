import {
    Socket
} from 'node:net';

import DeviceConnection from '#server/api/DeviceConnection.js';
import checkZeroResponse from '#server/data/zeroOneReply.js';

export default class SocketConnection extends DeviceConnection {

    #terminatorCharacter = undefined;
    #maxReadLength = undefined;
    #isBinary = false;

    #readLimitMaxCount = 10;
    #readCount = 0;

    constructor() {
        super();
        this.data = [];
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
                return reject(err);
            });

            this.device.on('data', msg => {
                const results = msg.toString()
                this.data.push(results);

                const cdata = this.data.join('').trim();

                if (this.#isBinary && cdata.length > 0) {
                    this.emit('readEnd');
                } else if (this.#terminatorCharacter) {

                    if (cdata.includes(this.#terminatorCharacter)) {
                        //console.log("emitting");
                        this.emit('readEnd');
                    }
                } else if (this.#maxReadLength &&
                    Number.isInteger(this.#maxReadLength)) {

                    if (cdata.length >= this.#maxReadLength) {
                        this.emit('readEnd');
                    }
                } else {
                    if (this.#readCount > this.#readLimitMaxCount) {
                        this.emit('readEnd');
                    }
                    this.#readCount++;
                }
            });
        });
    }

    sendRecieveCommand(command, hasResponse = true,
        isBinary = false, terminatorCharacter, maxReadLength) {

        return new Promise((resolve, reject) => {
            this.data = [];
            if (!this.device) {
                return reject('Not connected!');
            }

            this.#isBinary = isBinary;

            this.#terminatorCharacter = terminatorCharacter;

            this.#maxReadLength = maxReadLength;

            if (hasResponse) {
                this.#readCount = 0;
                this.once('readEnd', () => {
                    return resolve(this.data.join(''));
                });
            }

            this.device.write(command);
            if (!hasResponse) {
                return resolve('no reply');
            }
        });
    }

    disconnect() {
        return new Promise((resolve, reject) => {
            if (!this.device && this.isConnected()) {
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
