import {
    EventEmitter
} from 'node:events';

export default class DeviceConnection extends EventEmitter {

    constructor() {
        super();
        this.isConnected = false;
    }

    isConnected() {
        return this.isConnected;
    }

    connect(device, options) {
        throw new Error('Child must implement');
    }

    disconnect() {
        throw new Error('Child must implement');
    }

    sendCommand(command, returnsData = true) {
        throw new Error('Child must implement');
    }
}
