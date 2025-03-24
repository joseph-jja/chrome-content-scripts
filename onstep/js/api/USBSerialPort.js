import { SerialPort } from 'serialport'

import DeviceConnection from '#server/api/DeviceConnection.js';

export default class USBSerialPort extends DeviceConnection {

    constructor() {
        super();
    }

    connect(options) {
        return new Promise((resolve, reject) => {
            const {
                usbDevice
            } = options;

            if (!usbDevice) {
                return reject(`Invalid usb device ${usbDevice}!`);
            }

            try {
                this.device = new SerialPort({ path: usbDevice, baudRate: 9600 });
                this.device.once('open', (x) => {
                    console.log('Connected open', );
                    return resolve('Success');              
                });
                this.device.on('error', err => {
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
        return (this.device?.port?.fd ? true: false);
    }

    sendCommand(command, returnsData = true) {
        return new Promise(async (resolve, reject) => {
            this.data = [];
            if (!this.device && !this.connected()) {
                return reject('Not connected!');
            }

            const bytes = this.device.write(command);
            console.log('Data writen', bytes, command);
            /*if (!this.returnsData) {                
                this.device.write(':GVP#');
                console.log('No reply is expected, returning firmware name');
            }*/
            this.device.once('data', data => {
                const results = data?.toString(); 
                console.log('Results from read ', results);
                return resolve(results);
            });
        });
    }

    disconnect() {
        return new Promise((resolve, reject) => {
            if (!this.device || !this.isConnected()) {
                return reject('Not connected!');
            }
            this.device.close();
            this.connected = false;
            resolve('Closed');
        });
    }
}

