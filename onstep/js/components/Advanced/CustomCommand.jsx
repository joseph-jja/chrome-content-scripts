import React from 'react';

import Container from 'js/components/base/Container.jsx';
import CustomInput from 'js/components/base/CustomInput.jsx';
import CustomButton from 'js/components/base/CustomButton.jsx';
import ErrorMessage from 'js/components/base/ErrorMessage.jsx';
import {
    daisyChainBooleanCommands
} from 'js/utils/commandUtils.js';

const { useState } = React;

export default function CustomCommand() {
    const [commandField, setCommandField] = useState(null);
    const [commandFieldError, setCommandFieldError] = useState(null);
        
    const setCommandFromForm = (event) => {
        const value = event?.target?.value;
        setCommandField(value);
    }
    
    const sendCommandToServer = async () => {
        if (commandField) {
            setCommandFieldError('');
            const results = await daisyChainBooleanCommands([commandField]);
            setCommandFieldError(results);
        } else {
            setCommandFieldError('Invalid command entered!');
        }
    }
        
    return (
        <Container class="wrapper">
            <CustomInput type="text" labelText="Enter command (:xxxx#)" size="12"
                id="command-field" name="command_field" inputValue={commandField}
                onInputChange={setCommandFromForm}/>
            <ErrorMessage>{commandFieldError}</ErrorMessage>
            <br/>
            <CustomButton id="command-button" 
                 onButtonClick={sendCommandToServer}>Send Command</CustomButton>
        </Container>
    );
}
