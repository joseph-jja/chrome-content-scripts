import SerialPort from '#server/api/USBSerialPort.js';

const Connection = new SerialPort();

const TTY_DEVICE = '/dev/ttyACM0';

Connection.connect(TTY_DEVICE).then(async resp => {
    console.log('Success to connect', resp, Connection.usbPort, Connection.isConnected);
    
    try {
        const res = await Connection.sendCommand(':GC#');
        console.log(res);
    } catch(e) {
        console.log('Command error', e);
    }
    
    await Connection.disconnect();
}).catch(e => {        
    console.log('Failed to connect');
});


