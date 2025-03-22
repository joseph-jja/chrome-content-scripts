import React from 'react';

import Container from 'js/components/base/Container.jsx';
import CustomButton from 'js/components/base/CustomButton.jsx';
import ErrorMessage from 'js/components/base/ErrorMessage.jsx';
import {
    daisyChainBooleanCommands
} from 'js/utils/commandUtils.js';
import StorageBox from "js/storage/StorageBox.js";

const { useState } = React;

const DOBSONIAN_COLLIMATION_POSITION = '//:Sas10:00:00#';

// TODO figure out how this would work cross platform
export default function CollimationPosition() {
    const [collimate, setCollimate] = useState(null);
    const [collimateError, setCollimateError] = useState(null);

    const setCollimationPosition = async (event) => {
        const results = await daisyChainBooleanCommands([DOBSONIAN_COLLIMATION_POSITION, ':MA#', ':GA#']);
        setCollimateError(results);
    };

    return ( 
        <Container class="wrapper">
            <CustomButton id="collimate-position" 
                onButtonClick={setCollimationPosition}>Goto Collimation Position</CustomButton>
            <ErrorMessage>{collimateError}</ErrorMessage>                
        </Container>
    );
}
