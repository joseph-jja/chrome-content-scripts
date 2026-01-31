import { access } from 'node:fs/promises';
import SerialPort from '#server/api/SerialPort.js';

const Connection = new SerialPort();

const TTY_DEVICE = [ '/dev/ttyACM0', '/dev/ttyUSB0' ];

const getDevice = async () => {
    const devices = TTY_DEVICE.filter(async device => {
        try { 
            const exists = await access(device);
            if (exists) {
                return true;
            }
        } catch(_e) {
            return false;
        }
        return false;
    });
};

Connection.connect({ usbDevice: TTY_DEVICE }).then(async resp => {

    const device = await getDevice();
    if (!device) {
        console.log('Error no device found!');
    }
    
    //console.log('Success to connect', resp, Connection.usbPort, Connection.isConnected); 
    console.log('Success ', resp, Connection.isConnected());
    if (Connection.isConnected()) {
        console.log('We have a usb port and fd', Connection.device);
    }      
    
    try {
        const res = await Connection.sendCommand(':GC#');
        console.log(res);
    } catch(e) {
        console.log('Command error', e);
    }
    
    try {
        const res = await Connection.sendCommand(':Qe#', false);
        console.log(res);
    } catch(e) {
        console.log('Command error', e);
    }

    try {
        const res = await Connection.sendCommand(':Ga#');
        console.log(res);
    } catch(e) {
        console.log('Command error', e);
    }
    
    await Connection.disconnect();
}).catch(e => {        
    console.log('Failed to connect');
});


