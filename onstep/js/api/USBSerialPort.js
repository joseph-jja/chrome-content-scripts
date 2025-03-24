import { SerialPort } from 'serialport'

import DeviceConnection from '#server/api/DeviceConnection.js';

export default class USBSerialPort extends DeviceConnection {

    constructor() {
        super();
        this.usbPort = undefined;
    }

    connect(usbDevice) {
        return new Promise((resolve, reject) => {
            if (!usbDevice) {
                return reject(`Invalid usb device ${usbDevice}!`);
            }

            try {
                this.usbPort = new SerialPort({ path: usbDevice, baudRate: 9600 });
                this.usbPort.once('open', (x) => {
                    console.log('Connected open', );
                    return resolve('Success');              
                });
                this.usbPort.on('error', err => {
                    console.log('Error opening ', err);  
                    return reject(err);            
                });
            } catch (err) {
                console.log('Error: ', err);
                return reject(err);
            }
        });
    }
    
    isConnected() {
        return (this.usbPort?.port?.fd ? true: false);
    }

    sendCommand(command, returnsData = true) {
        return new Promise(async (resolve, reject) => {
            this.data = [];
            if (!this.usbPort && !this.isConnected()) {
                return reject('Not connected!');
            }

            const bytes = this.usbPort.write(command);
            console.log('Data writen', bytes, command);
            /*if (!this.returnsData) {                
                this.usbPort.write(':GVP#');
                console.log('No reply is expected, returning firmware name');
            }*/
            this.usbPort.once('data', data => {
                const results = data?.toString(); 
                console.log('Results from read ', results);
                return resolve(results);
            });
        });
    }

    disconnect() {
        return new Promise((resolve, reject) => {
            if (!this.usbPort || !this.isConnected()) {
                return reject('Not connected!');
            }
            this.usbPort.close();
            this.isConnected = false;
            resolve('Closed');
        });
    }
}

