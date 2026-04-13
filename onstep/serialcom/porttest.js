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

const writeResponseCode = serialcom.write(':GVT#');
const readResponseCode = serialcom.read(false, '#');

console.log(openResponseCode, writeResponseCode, readResponseCode);

const ACK = 0x06;
const ACKString = Buffer.from([ACK], 'hex');
console.log(ACKString);
const wrc = serialcom.write(ACKString);
const results = serialcom.read(true, '', 1);

const writeResponseCode2 = serialcom.write(':GVN#');
const readResponseCode2 = serialcom.read(false, '#');
console.log(writeResponseCode2, readResponseCode2);

const writeResponseCode3 = serialcom.write(':GVP#');
const readResponseCode3 = serialcom.read(false, '#');
console.log(writeResponseCode3, readResponseCode3);

const now = new Date();
const month = `${+now.getMonth() + 1}`.padStart(2, '0');
const day = `${+now.getDate()}`.padStart(2, '0');
const year = `${+now.getFullYear()}`.substring(2);
const writeResponseCode4 = serialcom.write(`:SC${month}/${day}/${year}#`);
const readResponseCode4 = serialcom.read(true);
console.log(writeResponseCode4, readResponseCode4);

const closeResponseCode = serialcom.close();

console.log(wrc, results, closeResponseCode);


