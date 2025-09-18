import {
    EventEmitter
} from 'node:events';

export default class DeviceConnection extends EventEmitter {

    constructor() {
        super();
        this.device = undefined;
        this.connected = false;
    }

    isConnected() {
        return (this.connected && this.device ? true : false);
    }

    connect(options) {
        throw new Error('Child must implement');
    }

    disconnect() {
        throw new Error('Child must implement');
    }

    sendCommand(command, returnsData = true) {
        throw new Error('Child must implement');
    }
}