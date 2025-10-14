import {
    Socket
} from 'node:net';

import DeviceConnection from '#server/api/DeviceConnection.js';
import checkZeroResponse from '#server/data/zeroOneReply.js';

export default class SocketConnection extends DeviceConnection {

    constructor() {
        super();
        this.data = [];
        this.endsWithHash = false;
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

                // TODO test this more
                if (this.endsWithHash) {
		        const cdata = this.data.join('').trim();
			    //console.log(cdata, "\n");
		    //console.log (cdata.charAt(cdata.length - 1));
		    if (cdata.charAt(cdata.length - 1) === '#') {
			//console.log("emitting");
                        this.emit('readEnd');
		    }
                } else if (this.data?.length > 0) {
                    this.emit('readEnd');
                }
            });
        });
    }

    sendCommand(command, returnsData = true) {
        return new Promise((resolve, reject) => {
            this.data = [];
            if (!this.device) {
                return reject('Not connected!');
            }

            if (returnsData && !checkZeroResponse(command)) {
                this.endsWithHash = true;
            }

            this.once('readEnd', () => {
                return resolve(this.data.join(''));
            });
            this.device.write(command);
            if (!returnsData) {
                this.removeAllListeners('readEnd');
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
