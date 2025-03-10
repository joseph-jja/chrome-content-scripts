import React from 'react';

import CustomInput from 'js/components/base/CustomInput.jsx';
import CustomButton from 'js/components/base/CustomButton.jsx';
import ErrorMessage from 'js/components/base/ErrorMessage.jsx';

const { useState } = React;

const HOST_PORT_RE = /\d+\.\d+\.\d+\.\d+\:\d*/;

export default function HostConnection() {
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
            <div>
                <CustomInput type="text" labelText="Enter Host:Port (xxx.xxx.xxx.xxx:yyyy)"
                    id="host-port" name="host_port" inputValue={hostPort} size="22"
                    onInputChange={setHostPortField}/>
                <ErrorMessage>{hostPortError}</ErrorMessage>
                <br/>
                <CustomButton id="host-setup" 
                    onButtonClick={sendConnectCommand}>Connect</CustomButton>

            </div>
        </>
    );
}


