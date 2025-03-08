import React from 'react';

import CustomInput from 'js/components/CustomInput.jsx';
import CustomButton from 'js/components/CustomButton.jsx';
import ErrorMessage from 'js/components/ErrorMessage.jsx';

const { useState } = React;

const HOST_PORT_RE = /\d+\.\d+\.\d+\.\d+\:\d*/;

export default function Setup() {
    const [hostPort, setHostPort] = useState(null);
    const [hostPortError, setHostPortError] = useState('');

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

    return (
        <>
            <CustomInput type="text" labelText="Enter Host:Port (xxx.xxx.xxx.xxx:yyyy)"
                id="host-port" name="host_port" inputValue={hostPort}
                errorValue={hostPortError}
                onInputChange={setHostPortField}/>
            <CustomButton id="host-setup" onButtonClick={sendConnectCommand}>Connect</CustomButton>
            <ErrorMessage>{hostPortError}</ErrorMessage>
        </>
    );
}
