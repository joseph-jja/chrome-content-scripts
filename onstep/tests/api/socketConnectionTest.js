

import SocketConnection from '#server/api/SocketConnection.js';

const Connection = new SocketConnection();


const host = '192.168.0.1',
    port = 9999;
    
Connection.connect(host, port).then(async resp => {
    console.log('Success to connect');
    
    const res = await Connection.sendCommand('GET /\r\n\r\n');
    console.log(res);
    
    await Connection.disconnect();
}).catch(e => {        
    console.log('Failed to connect');
});

