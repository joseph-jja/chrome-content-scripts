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

const DOBSONIAN_COLLIMATION_POSITION = '//:Sas10:00:00#';

// TODO figure out how this would work cross platform
export default function CollimationPosition() {
    const [homeSync, setHomeSync] = useState(null);
    const [homeSyncError, setHomeSyncError] = useState(null);
    const [azHome, setAzHome] = useState(null);
    const [altHome, setAltHome] = useState(null);
    const [collimate, setCollimate] = useState(null);
    const [collimateError, setCollimateError] = useState(null);

    const setCollimationPosition = async (event) => {
        const results = await daisyChainBooleanCommands([DOBSONIAN_COLLIMATION_POSITION, ':MA#', ':GA#']);
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
                onInputChange={setField}/>
            <br/>
            <CustomInput type="text" labelText="Set Altitude" size="12"
                id="altHome" name="altHome" inputValue={altHome}
                onInputChange={setField}/>
            <br/>
            <CustomButton id="set-coords" 
                onButtonClick={setCoordinates}>Set Coordinates</CustomButton>
            <CustomButton id="get-coords" 
                onButtonClick={getCoordinates}>Get Coordinates</CustomButton>
            <CustomButton id="collimate-position" 
                onButtonClick={setCollimationPosition}>Goto Collimation Position</CustomButton>
            <ErrorMessage>{collimateError}</ErrorMessage>                
        </CustomFieldset>
    );
}
