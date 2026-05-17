// so node modules can only use require
//import { createRequire } from 'module';
//const require = createRequire(import.meta.url);

const fs = require('node:fs');

const basedir = process.cwd();

const serialcom = require(basedir + '/build/Release/serialcom.node');

const findport = () => {

    const ports = ['/dev/ttyUSB0', '/dev/ttyACM0'];
    const results = ports.filter(port => {
        if (fs.existsSync(port)) {
            return true;
        }
        return false;
    });

    return results[0];
};

const port = findport();
if (!port) {
    console.error('Could not find port to open!');
    process.exit(-1);
}

const openResponseCode = serialcom.open(port, 'B9600');
console.log('Open response code ', openResponseCode);

const writeResponseCode = serialcom.write(':GW#');
const readResponseCode = serialcom.read(false, '#');

console.log('Read response code ', readResponseCode, 'Write response code ', writeResponseCode);

const ACK = 0x06;
const ACKString = Buffer.from([ACK], 'hex');
console.log('ACK ', ACKString);
const wrc = serialcom.write(ACKString);
const results = serialcom.read(true, '', 1);
console.log('ACK response code ', results, 'Write response code ', wrc);

const writeResponseCode3 = serialcom.write(':SXEM,3#')
const readResponseCode3 = serialcom.read(true, '', 1);
console.log('Read response code ', readResponseCode3, 'Write response code ', writeResponseCode3);

const closeResponseCode = serialcom.close();

console.log('Closed ',closeResponseCode);
