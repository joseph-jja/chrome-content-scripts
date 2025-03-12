import React from 'react';

import CustomInput from 'js/components/base/CustomInput.jsx';
import CustomButton from 'js/components/base/CustomButton.jsx';
import ErrorMessage from 'js/components/base/ErrorMessage.jsx';
import {
    setupConnection,
    teardownConnection
} from 'js/api/request.js';

const { useState } = React;

const SERIAL_PORT_RE = /\/dev\//;

export default function PortConnection() {
    const [serialPort, setSerialPort] = useState(null);
    const [serialPortError, setSerialPortError] = useState('');

    const setSerialPortField = (event) => {
        setSerialPort(event?.target?.value);
    }

    const sendConnectCommand = () => {
        if (serialPort && serialPort.match(SERIAL_PORT_RE)) {
            setSerialPortError('');
            // now we need to call fetch
            // and send to server
            setupConnection(serialPort).then(data => {
                setSerialPortError(data);    
            }).catch(e => {
                setSerialPortError(e);
            });
        } else {
            setSerialPortError('Invalid serial port entered!');
        }
    }
    
    const sendDisconnectCommand = () => {
        teardownConnection().then(data => {
            setSerialPortError(data);    
        }).catch(e => {
            setSerialPortError(e);
        });
    }
        
    return (
        <>
            <div>
                <CustomInput type="text" labelText="Enter Serial Port (/dev/xxxx)"
                    id="serial-port" name="serial_port" inputValue={serialPort} size="22"
                    onInputChange={setSerialPortField}/>
                <ErrorMessage>{serialPortError}</ErrorMessage>
                <br/>
                <CustomButton id="serial-connect" 
                    onButtonClick={sendConnectCommand}>Connect</CustomButton>
                <CustomButton id="serial-disconnect" 
                    onButtonClick={sendDisconnectCommand}>Disconnect</CustomButton>
            </div>
        </>
    );
}


