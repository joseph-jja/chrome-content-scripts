import React from 'react';

import Container from 'js/components/base/Container.jsx';
import CustomButton from 'js/components/base/CustomButton.jsx';
import ErrorMessage from 'js/components/base/ErrorMessage.jsx';
import {
    sendCommand
} from 'js/api/request.js';
import PromiseWrapper from 'js/utils/PromiseWrapper.js';

const { useState } = React;

// TODO figure out how this would work cross platform
export default function Directions() {
    const [direction, setDirection] = useState(null);
    const [directionError, setDirectionError] = useState(null);

    const setMovementValue = async (event) => {
        const targetObj = event?.target?.id;
        let cmd;
        if (targetObj === 'direction-north') {
            cmd = ':Qn#';
            setDirection(targetObj);
        } else if (targetObj === 'direction-south') {
            cmd = ':Qs#';
            setDirection(targetObj);
        } else if (targetObj === 'direction-east') {
            cmd = ':Qe#';
            setDirection(targetObj);
        } else if (targetObj === 'direction-west') {
            cmd = ':Qw#';
            setDirection(targetObj);
        }
        if (cmd) {
            const [err, results] = await PromiseWrapper(sendCommand(cmd, false));
            if (err || results !== 0) {
                setDirectionError(err || results);
            } else {
                setDirectionError('');
            }
        }
    };

    return ( 
        <Container class="wrapper">
            <CustomButton id="direction-north" 
                onButtonClick={setMovementValue}>North</CustomButton>
            <CustomButton id="direction-south" 
                onButtonClick={setMovementValue}>South</CustomButton>
            <br/>
            <CustomButton id="direction-east" 
                onButtonClick={setMovementValue}>East</CustomButton>
            <CustomButton id="direction-west" 
                onButtonClick={setMovementValue}>West</CustomButton>
            <ErrorMessage>{directionError}</ErrorMessage>                
        </Container>
    );
}
