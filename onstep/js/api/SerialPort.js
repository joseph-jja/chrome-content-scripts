import fs from 'node:fs/promises';

export default class SerialPort extends EventEmitter {
    
    constructor() {
        super();
        this.socket = undefined;
        this.data = [];
        this.isConnected = false;
    }

    connect(ttyDevice) {
        return new Promise((resolve, reject) => {
        
           //    const fd = await fs.open('/dev/ttyACM0', 'r+');
        });
    }
    
    sendCommand(command) {
        return new Promise((resolve, reject) => {
        
            //await fd.write(':GC#');
            /*
            const  data = await fd.read();
    const buffer = new Int8Array(data.buffer);
    let result = '',
        i = 0,
        end = buffer.length;
    while (!result.includes('#') && i < end) {
        const charData = String.fromCharCode( buffer[ i ] );
        console.log(charData, charData.length);
        result += charData;
        i++;
    }   
        */
        });
    }

    disconnect() {
        return new Promise((resolve, reject) => {
        
        //fd.close();
        });
    }
}

/*
async function doStuff() {

    const fd = await fs.open('/dev/ttyACM0', 'r+');

    await fd.write(':GC#');
    const  data = await fd.read();
    const buffer = new Int8Array(data.buffer);
    let result = '',
        i = 0,
        end = buffer.length;
    while (!result.includes('#') && i < end) {
        const charData = String.fromCharCode( buffer[ i ] );
        console.log(charData, charData.length);
        result += charData;
        i++;
    }
    console.log(result);
    fd.close();
}*/

//doStuff();

