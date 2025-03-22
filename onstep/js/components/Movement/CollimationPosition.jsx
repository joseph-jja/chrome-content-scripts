import React from 'react';

import Container from 'js/components/base/Container.jsx';
import CustomButton from 'js/components/base/CustomButton.jsx';
import ErrorMessage from 'js/components/base/ErrorMessage.jsx';
import {
    sendCommand
} from 'js/api/request.js';
import PromiseWrapper from 'js/utils/PromiseWrapper.js';

const { useState } = React;

const DOBSONIAN_COLLIMATION_POSITION = '//:Sas10:00:00#';

// TODO figure out how this would work cross platform
export default function CollimationPosition() {
    const [collimate, setCollimate] = useState(null);
    const [collimateError, setCollimateError] = useState(null);

    const setCollimationPosition = async (event) => {
        const targetObj = event?.target?.id;
        const [err, results] = await PromiseWrapper(sendCommand(DOBSONIAN_COLLIMATION_POSITION, true));
        if (err || results !== 0) {
            setCollimateError(err || results);
        } else {
            setCollimateError('');
        }
    };

    return ( 
        <Container class="wrapper">
            <CustomButton id="collimate-position" 
                onButtonClick={setCollimationPosition}>Goto Collimation Position</CustomButton>
            <ErrorMessage>{collimateError}</ErrorMessage>                
        </Container>
    );
}
