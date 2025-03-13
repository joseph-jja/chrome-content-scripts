import React from 'react';

import CustomInput from 'js/components/base/CustomInput.jsx';
import CustomButton from 'js/components/base/CustomButton.jsx';
import ErrorMessage from 'js/components/base/ErrorMessage.jsx';
import {
    setupConnection,
    teardownConnection
} from 'js/api/request.js';

const { useState } = React;

const HOST_PORT_RE = /\d+\.\d+\.\d+\.\d+\:\d*/;
const SERIAL_PORT_RE = /\/dev\//;

export default function Connection() {
    const [hostPort, setHostPort] = useState(null);
    const [serialPort, setSerialPort] = useState(null);
    const [serialOrHostPortError, setSerialOrHostPortError] = useState('');

    const setSerialPortField = (event) => {
        setSerialPort(event?.target?.value);
    }
    const setHostPortField = (event) => {
        setHostPort(event?.target?.value);
    }

    const sendConnectCommand = () => {
        if (hostPort && hostPort.match(HOST_PORT_RE)) { 
            setSerialOrHostPortError('');
            // now we need to call fetch
            // and send to server
            setupConnection(hostPort).then(data => {
                setHostPortError(data);    
            }).catch(e => {
                setHostPortError(e);
            });
        } else if (serialPort && serialPort.match(SERIAL_PORT_RE)) {
            setSerialOrHostPortError('');
            // now we need to call fetch
            // and send to server
            setupConnection(hostPort).then(data => {
                setHostPortError(data);  
            }).catch(e => {
                setHostPortError(e);
            });
        } else {
            setSerialOrHostPortError('Invalid host and port or COM / tty port entered!');
        }
    }
    
    const sendDisconnectCommand = () => {
        teardownConnection().then(data => {
            setHostPortError(data);    
        }).catch(e => {
            setHostPortError(e);
        });
    }
    
    return (
        <div>
            <CustomInput type="text" labelText="Enter Host:Port (xxx.xxx.xxx.xxx:yyyy)"
                    id="host-port" name="host_port" inputValue={hostPort} size="22"
                    onInputChange={setHostPortField}/>
            { window.electron.operatingSystem() === 'linux' ?
                <CustomInput type="text" labelText="Enter Serial Port (/dev/xxxx)"
                    id="serial-port" name="serial_port" inputValue={serialPort} size="22"
                    onInputChange={setSerialPortField}/> : null }
            <ErrorMessage>{serialOrHostPortError}</ErrorMessage>
            <br/>
            <CustomButton id="serial-connect" 
                onButtonClick={sendConnectCommand}>Connect</CustomButton>
            <CustomButton id="serial-disconnect" 
                onButtonClick={sendDisconnectCommand}>Disconnect</CustomButton>
    );
}
