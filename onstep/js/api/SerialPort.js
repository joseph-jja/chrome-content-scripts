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
        if (!ttyDevice) {
            return reject('Invalid host and or port!');
        }

        fs.open(ttyDevice, 'r+').then(fd => {
            this.socket = fd;
            this.isConnected = true;
            resolve('Success');
          }).catch(e => {
              reject(e);
          });
        });
    }

    sendCommand(command) {
        return new Promise((resolve, reject) => {
            this.data = [];
            if (!this.socket) {
                return reject('Not connected!');
            }

            fd.write(':GC#').then(async res => {
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
                  resolve(result);
            }).catch(e => {
                reject(e);
            });
      });

    disconnect() {
        return new Promise((resolve, reject) => {
            if (!this.socket) {
                return reject('Not connected!');
            }
            this.socket.close();
            this.isConnected = false;
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

