import createConnection from 'node:net';

const client = createConnection({
    host: '192..168.0.1',
    port: 9999
}, () => {
    // 'connect' listener.
    console.log('connected to server!');
    client.write('world!\r\n');
});
client.on('data', (data) => {
    console.log(data.toString());
    client.end();
});
client.on('end', () => {
    console.log('disconnected from server');
});