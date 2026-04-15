import React from 'react';

import Container from 'js/components/base/Container.jsx';
import CustomInput from 'js/components/base/CustomInput.jsx';
import CustomButton from 'js/components/base/CustomButton.jsx';
import ErrorMessage from 'js/components/base/ErrorMessage.jsx';
import {
    sendCommand
} from 'js/api/request.js';
import {
    safeParse
} from 'js/utils/jsonUtils.js';
import PromiseWrapper from 'js/utils/PromiseWrapper.js';

const {
    useState
} = React;

export default function CustomCommand() {
    const [commandField, setCommandField] = useState(null);
    const [commandFieldError, setCommandFieldError] = useState(null);
    const [booleanReply, setBooleanReply] = useState(false);
    const [hasReply, setHasReply] = useState(false);
    const [terminatorCharacter, setTerminatorCharacter] = useState(null);
    const [stopReadLimit, setStopReadLimit] = useState(null);

    const setCommandFromForm = (event) => {
        const value = event?.target?.value;
        setCommandField(value);
    }

    const setBooleanFromForm = (event) => {
        const value = safeParse(event?.target?.checked);
        setBooleanReply(value);
    }
    
    const setHasReplyFromForm = (event) => {
        const value = safeParse(event?.target?.checked);
        setHasReply(value);
    }

    const setTermFromForm = (event) => {
        const value = event?.target?.value;
        setTerminatorCharacter(value);
    }

    const setStopReadLimitFromForm = (event) => {
        const value = safeParse(event?.target?.value);
        setStopReadLimit(value);
    }

    const sendCommandToServer = async () => {
        if (commandField) {
            setCommandFieldError('');
            const [err, results] = await PromiseWrapper(sendCommand(commandField,
                booleanReply,
                hasReply,
                terminatorCharacter,
                stopReadLimit));
            setCommandFieldError(err || results);
        } else {
            setCommandFieldError('Invalid command entered!');
        }
    }

    return (
        <Container class="wrapper">
            <CustomInput type="text" labelText="Enter command" size="12"
                id="command-field" name="command_field" inputValue={commandField}
                placeholderText=":xxxx#"
                onInputChange={setCommandFromForm}/>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <CustomInput type="checkbox" labelText="Boolean Reply" 
                id="boolean-field" name="boolean_field" inputValue={booleanReply}
                onInputChange={setBooleanFromForm}/>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <CustomInput type="checkbox" labelText="Has Reply" 
                id="has-reply-field" name="has_reply_field" inputValue={hasReply}
                onInputChange={setHasReplyFromForm}/>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <CustomInput type="text" labelText="Stop Character" size="3"
                id="terminator-field" name="terminator_field" inputValue={terminatorCharacter}
                onInputChange={setTermFromForm}/>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <CustomInput type="text" labelText="Stop Read Limit" size="5"
                id="stop-limit-field" name="stop_limit_field" inputValue={stopReadLimit}
                onInputChange={setStopReadLimitFromForm}/>
            <ErrorMessage>{commandFieldError}</ErrorMessage>
            <br/>
            <CustomButton id="command-button" 
                 onButtonClick={sendCommandToServer}>Send Command</CustomButton>
        </Container>
    );
}
