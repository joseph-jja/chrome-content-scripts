import {
    access
} from 'node:fs/promises';
import SerialPort from '#server/api/SerialPort.js';

const Connection = new SerialPort();

const TTY_DEVICE = ['/dev/ttyACM0', '/dev/ttyUSB0'];

const getDevice = async () => {
    const devices = TTY_DEVICE.filter(async device => {
        try {
            const exists = await access(device);
            if (exists) {
                return true;
            }
        } catch (_e) {
            return false;
        }
        return false;
    });
    return devices[0];
};

const device = await getDevice();
console.log(device);
if (!device) {
    console.log('Error no device found!');
    process.exit(-1);
}

Connection.connect({
    usbDevice: device
}).then(async resp => {

    //console.log('Success to connect', resp, Connection.usbPort, Connection.isConnected); 
    console.log('Success ', resp, Connection.isConnected());
    if (Connection.isConnected()) {
        console.log('We have a usb port and fd', Connection.device);
    }

    try {
        const res = await Connection.sendRecieveCommand(':GC#', true, false, '#');
        console.log(res);
    } catch (e) {
        console.log('Command error', e);
    }

    try {
        const res = await Connection.sendRecieveCommand(':Qe#', false);
        console.log(res);
    } catch (e) {
        console.log('Command error', e);
    }

    try {
        const res = await Connection.sendRecieveCommand(':Ga#', true, false, '#');
        console.log(res);
    } catch (e) {
        console.log('Command error', e);
    }

    await Connection.disconnect();
}).catch(e => {
    console.log('Failed to connect');
});