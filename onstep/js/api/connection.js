import createConnection from 'node:net';

let client;

export function connectionOverWifi(hostPort) { 

    return new Promise((resolve, reject) => {
        const [ host, port ] = hostPort.split(':');
        if (!host || !port) {
            return reject('Invalid host and port');
        }
        
        const client = createConnection({
            host: host,
            port: port
        }, () => {
            // 'connect' listener.
            client.write('world!\r\n');
        });
    }

    client.on('data', (data) => {
        console.log(data.toString());
        client.end();
    });
    client.on('end', () => {
        console.log('disconnected from server');
    });
}
