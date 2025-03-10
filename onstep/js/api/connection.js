import createConnection from 'node:net';

class WifiConnection() {

    constructor() {
        this.client = undefined;
    }

    connect(host, port) {
        return new Promise((resolve, reject) => {
            if (!host || !port) {
                return reject('Invalid host and or port!');
            }
            this.client = createConnection({
                host: host,
                port: port
            }, () => {
                return resolve(client);
            });
        });
    }

    sendCommand(command) {
        return new Promise((resolve, reject) => {
            if (!this.client) {
                return reject('Not connected!');
            }
            this.client.once('error', (err) => {
                this.client.off('data');
                reject(err);
            });

            this.client.once('data', (data) => {
                this.client.off('error');
                resolve(data);
            });
		    this.client.write(command);
        });
    }

    disconnect() {
        return new Promise((resolve, reject) => {
            if (!this.client) {
                return reject('Not connected!');
            }
            this.client.end();
        });
    }
}
