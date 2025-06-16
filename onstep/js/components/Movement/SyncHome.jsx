import React from 'react';

import Container from 'js/components/base/Container.jsx';
import CustomInput from 'js/components/base/CustomInput.jsx';
import CustomButton from 'js/components/base/CustomButton.jsx';
import ErrorMessage from 'js/components/base/ErrorMessage.jsx';
import {
    sendCommand
} from 'js/api/request.js';
import PromiseWrapper from 'js/utils/PromiseWrapper.js';

const { useState } = React;

// TODO figure out how this would work cross platform
export default function SyncHome() {
    const [homeSync, setHomeSync] = useState(null);
    const [homeSyncError, setHomeSyncError] = useState(null);
    const [azHome, setAzHome] = useState(null);
    const [altHome, setAltHome] = useState(null);

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

    const setSyncHomeValue = async (event) => {
        const targetObj = event?.target?.id;
        let cmd;
        if (targetObj === 'go-home') {
            cmd = ':hC#';
            setHomeSync(targetObj);
        } else if (targetObj === 'sync-position') {
            cmd = ':CM#';
            setHomeSync(targetObj);
        } else if (targetObj === 'stop-movement') {
            cmd = ':Q#';
            setHomeSync(targetObj);
        }
        if (cmd) {
            const [err, results] = await PromiseWrapper(sendCommand(cmd));
            if (err || results !== 0) {
                setHomeSyncError(err || results);
            } else {
                setHomeSyncError('');
            }
        }
    };

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
            // do something with results
            // setAzHome(value);
            // StorageBox.setItem('azHome', value);
            // setAltHome(value);
            // StorageBox.setItem('altHome', value);
        }
    };
    
    const getCoordinates = async (event) => {
        const commands = [':GZ#', ':GA#'];
        const results = await daisyChainBooleanCommands(commands);
        setHomeSyncError(results);
    };

    return ( 
        <Container class="wrapper">
            <CustomButton id="go-home" 
                onButtonClick={setSyncHomeValue}>Go To Home Position</CustomButton>
            <CustomButton id="sync-position" 
                onButtonClick={setSyncHomeValue}>Sync Position</CustomButton>
            <CustomButton id="stop-movement" 
                onButtonClick={setSyncHomeValue}>Stop Movement</CustomButton>
            <br/>
            <CustomInput type="text" labelText="Set Azimuth" size="12"
                id="azimuth" name="azimuth" inputValue={azHome}
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
            <br/>
            <ErrorMessage>{homeSyncError}</ErrorMessage>                
        </Container>
    );
}
