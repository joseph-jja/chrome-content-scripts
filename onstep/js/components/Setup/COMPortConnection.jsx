import React from 'react';

import CustomInput from 'js/components/base/CustomInput.jsx';
import CustomButton from 'js/components/base/CustomButton.jsx';
import ErrorMessage from 'js/components/base/ErrorMessage.jsx';

const { useState } = React;

// TODO figure out how this would work cross platform
export default function COMPortConnection() {
    const [comPort, setComPort] = useState(null);
    const [comPortError, setComPortError] = useState('');

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
                <CustomInput type="text" labelText="Enter com port /dev/xxxx"
                    id="com-port" name="com_port" inputValue={comPort}
                    onInputChange={setComPortField}/>
                <ErrorMessage>{comPortError}</ErrorMessage>
                <br/>
                <CustomButton id="com-port-setup" 
                    onButtonClick={sendPortConnectCommand}>Connect</CustomButton>
            </div>
        </>
    );      
}

