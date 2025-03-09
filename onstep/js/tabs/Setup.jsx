import React from 'react';

import CustomInput from 'js/components/base/CustomInput.jsx';
import CustomButton from 'js/components/base/CustomButton.jsx';
import ErrorMessage from 'js/components/base/ErrorMessage.jsx';

const { useState } = React;

const HOST_PORT_RE = /\d+\.\d+\.\d+\.\d+\:\d*/;

export default function Setup() {
    const [hostPort, setHostPort] = useState(null);
    const [hostPortError, setHostPortError] = useState('');
    const [comPort, setComPort] = useState(null);
    const [comPortError, setComPortError] = useState('');

    const setHostPortField = (event) => {
        setHostPort(event?.target?.value);
    }

    const sendConnectCommand = () => {
        if (hostPort && hostPort.match(HOST_PORT_RE)) {
            setHostPortError('');
            // now we need to call fetch
            // and send to server
        } else {
            setHostPortError('Invalid host and port entered!');
        }
    }

    const setComPortField = (event) => {
        setComPort(event?.target?.value);
    }

    const sendPortConnectCommand = () => {
        if (comPort && comPort.length > 0) {
            setComPortError('');
            // now we need to call fetch
            // and send to server
        } else {
            setComPortError('Invalid com port entered!');
        }
    }

    return (
        <>
            <div>
                <CustomInput type="text" labelText="Enter Host:Port (xxx.xxx.xxx.xxx:yyyy)"
                    id="host-port" name="host_port" inputValue={hostPort}
                    errorValue={hostPortError}
                    onInputChange={setHostPortField}/>
                <CustomButton id="host-setup" onButtonClick={sendConnectCommand}>Connect</CustomButton>
                <ErrorMessage>{hostPortError}</ErrorMessage>
            </div>
            {/*
            TODO figure out how this would work cross platform
            <div>
                <CustomInput type="text" labelText="Enter com port /dev/xxxx"
                    id="com-port" name="com_port" inputValue={comPort}
                    errorValue={comPortError}
                    onInputChange={setComPortField}/>
                <CustomButton id="com-port-setup" onButtonClick={sendPortConnectCommand}>Connect</CustomButton>
                <ErrorMessage>{comPortError}</ErrorMessage>
            </div>
            */}
            <div>
                <CustomInput type="text" labelText="Set Latitude and Longitude"
                    id="host-port" name="host_port" inputValue={hostPort}
                    errorValue={hostPortError}
                    onInputChange={setHostPortField}/>
                <CustomButton id="host-setup" onButtonClick={sendConnectCommand}>Connect</CustomButton>
                <ErrorMessage>{hostPortError}</ErrorMessage>
            </div>
        </>
    );
}
