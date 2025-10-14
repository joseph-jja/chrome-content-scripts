

import SocketConnection from '#server/api/SocketConnection.js';

const Connection = new SocketConnection();


const host = '192.168.0.1',
    port = 9999;
    
Connection.connect({ host: host, port: port }).then(async resp => {
    //console.log('Success to connect', resp, Connection.usbPort, Connection.isConnected); 
    console.log('Success ', resp, Connection.isConnected());
    if (Connection.isConnected()) {
        console.log('We have a usb port and fd');//, Connection.device);
    }      
    
    try {
        const res = await Connection.sendCommand(':FA#');
        console.log("Got 1", res);
    } catch(e) {
        console.log('Command error 1', e);
    }
    
    try {
        const res = await Connection.sendCommand(':Fa#', false);
        console.log("Got 2", res);
    } catch(e) {
        console.log('Command error 2', e);
    }

    try {
        const res = await Connection.sendCommand(':FM#');
        console.log(res);
    } catch(e) {
        console.log('Command error 3', e);
    }
    
    await Connection.disconnect();
}).catch(e => {        
    console.log('Failed to connect');
});


