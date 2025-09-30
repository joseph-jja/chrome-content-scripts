// so node modules can only use require
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const basedir = process.cwd();

const serialcom = require(basedir + '/serialcom.node');

const openResponseCode = serialcom.open('/dev/ttyUSB0', 'B9600');

const writeResponseCode = serialcom.write(':GVT#');
const readResponseCode = serialcom.read(false, '#');

const closeResponseCode = serialcom.close();

console.log(openResponseCode, writeResponseCode, readResponseCode, closeResponseCode);
