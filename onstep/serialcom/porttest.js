// so node modules can only use require
//import { createRequire } from 'module';
//const require = createRequire(import.meta.url);

const basedir = process.cwd();

const serialcom = require(basedir + '/build/Release/serialcom.node');

const openResponseCode = serialcom.open('/dev/ttyUSB0', 'B9600');

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


