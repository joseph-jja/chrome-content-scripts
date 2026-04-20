import SerialPort from '#server/api/SerialPort.js';
import SocketConnection from '#server/api/SocketConnection.js';

let connection;

export async function connect(options) {

    if (connection) {
        return connection;
    }

    if (options.host && options.port) {
        connection = new SocketConnection();
        return connection.connect({
            host: options.host,
            port: options.port
        });
    } else if (options.device) {
        connection = new SerialPort();
        return connection.connect({
            usbDevice: options.device
        });
    }
    return Promise.reject('Connection failed because of invalid connection options!');
}

export async function sendCommand(command, isBoolean, hasResponse, terminatorCharacter, maxReadLength) {

    if (connection?.isConnected() && command && command.startsWith(':') && command.endsWith('#')) {

        const terminatorChar = terminatorCharacter ?
            decodeURIComponent(terminatorCharacter) : undefined;

        const forceResponseResponse = hasResponse ||
            isBoolean || terminatorChar ||
            Number.isInteger(maxReadLength);

        console.log('Should be returning data? ', forceResponseResponse, 'boolean? ', isBoolean, 'Termination character? ', terminatorChar, 'Maximum read length? ', maxReadLength);

        return connection.sendRecieveCommand(command, hasResponse,
            isBoolean, terminatorChar, maxReadLength)
    }
    return Promise.reject('Not connected or invalid command!');
}

export function disconnect() {

    if (connection?.isConnected()) {
        connection.disconnect();
        connection = null;
    }
}
