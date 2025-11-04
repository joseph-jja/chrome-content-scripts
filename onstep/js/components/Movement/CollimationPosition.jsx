import React from 'react';

import CustomFieldset from 'js/components/base/CustomFieldset.jsx';
import CustomInput from 'js/components/base/CustomInput.jsx';
import CustomButton from 'js/components/base/CustomButton.jsx';
import ErrorMessage from 'js/components/base/ErrorMessage.jsx';
import {
    daisyChainBooleanCommands
} from 'js/utils/commandUtils.js';
import StorageBox from "js/storage/StorageBox.js";

const { useState } = React;

const DOBSONIAN_COLLIMATION_ALTITUDE = 	':Sa+00:00:00#';
const DOBSONIAN_COLLIMATION_AZMIUTH = ':Szs00:00:00#';

// TODO figure out how this would work cross platform
export default function CollimationPosition() {
    const [homeSync, setHomeSync] = useState(null);
    const [homeSyncError, setHomeSyncError] = useState(null);
    const [azHome, setAzHome] = useState(null);
    const [altHome, setAltHome] = useState(null);
    const [collimate, setCollimate] = useState(null);
    const [collimateError, setCollimateError] = useState(null);

    const setCollimationPosition = async (event) => {
        const cmds = [
            DOBSONIAN_COLLIMATION_ALTITUDE,
            DOBSONIAN_COLLIMATION_AZMIUTH,
            ':MA#', ':GA#', ':GZ#'
        ];
        const results = await daisyChainBooleanCommands(cmds);
        setCollimateError(results);
    };

    const setField = (event) => {
        const fieldName = event?.target?.name;
        if (!fieldName) {
            return;
        }
        const value = event?.target?.value || null;
        if (fieldName === 'azHome') {
            setAzHome(value);
            StorageBox.setItem('azHome', value);
        } else if (fieldName === 'altHome') {
            setAltHome(value);
            StorageBox.setItem('altHome', value);
        }
    }

    const setCoordinates = async (event) => {
        let haveAlt = false, haveAz = false;
        if (azHome && azHome.length >= 0) {
            haveAz = true;
        }
        if (altHome && altHome.length >= 0) {
            haveAlt = true;
        }
        if (haveAlt && haveAz) {
            // send message
            const commands = [`:Sz${azHome}#`, ':GZ#', `:Sa${altHome}#`, ':GA#'];
            const results = await daisyChainBooleanCommands(commands);
            setHomeSyncError(results);
        }
    };
    
    const getCoordinates = async (event) => {
        const commands = [':GZ#', ':GA#'];
        const results = await daisyChainBooleanCommands(commands);
        setHomeSyncError(results);
    };

    return ( 
        <CustomFieldset legendtext="Move To Position">
            <CustomInput type="text" labelText="Set Azimuth" size="12"
                id="azHome" name="azHome" inputValue={azHome}
                placeholderText="+/-00:00:00"
                onInputChange={setField}/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <CustomInput type="text" labelText="Set Altitude" size="12"
                id="altHome" name="altHome" inputValue={altHome}
                placeholderText="+/-00:00:00"
                onInputChange={setField}/>
            <br/>
            <CustomButton id="set-coords" 
                onButtonClick={setCoordinates}>Set</CustomButton>
            <CustomButton id="get-coords" 
                onButtonClick={getCoordinates}>Get</CustomButton>
            <CustomButton id="collimate-position" 
                onButtonClick={setCollimationPosition}>Collimation Position</CustomButton>
            <ErrorMessage>{collimateError}</ErrorMessage>                
        </CustomFieldset>
    );
}
