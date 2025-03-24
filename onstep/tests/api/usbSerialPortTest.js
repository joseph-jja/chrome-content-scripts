import SerialPort from '#server/api/USBSerialPort.js';

const Connection = new SerialPort();

const TTY_DEVICE = '/dev/ttyACM0';

Connection.connect({ usbDevice: TTY_DEVICE }).then(async resp => {
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


