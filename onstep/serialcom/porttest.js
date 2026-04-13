// so node modules can only use require
//import { createRequire } from 'module';
//const require = createRequire(import.meta.url);

const basedir = process.cwd();

const serialcom = require(basedir + '/build/Release/serialcom.node');

const openPort = () => {
    const ports = ['/dev/ttyUSB0', '/dev/ttyACM0'];
    let returnCode = -1;
    ports.forEach(port => {
        try {
            rc = serialcom.open(port, 'B9600');
            if (rc > 0) {
                returnCode = rc;
            } else {
                console.error('Could not open port: ', port);
            }
        } catch(e) {
            console.error(`${e.message}`);
        }
    });
    return returnCode;
};

const openResponseCode = openPort();
if (openResponseCode <= 0) {
    console.error('Could not find port to open!');
    process.exit(openResponseCode);
}

const writeResponseCode = serialcom.write(':GVT#');
const readResponseCode = serialcom.read(false, '#');

console.log(openResponseCode, writeResponseCode, readResponseCode);

const ACK = 0x06;
const ACKString = Buffer.from([ACK], 'hex');
console.log(ACKString);
const wrc = serialcom.write(ACKString);
const results = serialcom.read(true, '');

const closeResponseCode = serialcom.close();

console.log(wrc, results, closeResponseCode);


