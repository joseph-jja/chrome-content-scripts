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
export default function SyncHome() {
    const [homeSync, setHomeSync] = useState(null);
    const [homeSyncError, setHomeSyncError] = useState(null);

    const setSyncHomeValue = async (event) => {
        const targetObj = event?.target?.id;
        let cmd;
        if (targetObj === 'go-home') {
            cmd = ':hC#';
            setHome(targetObj);
        } else if (targetObj === 'sync-position') {
            cmd = ':CM#';
            setHome(targetObj);
        }
        if (cmd) {
            const [err, results] = await PromiseWrapper(sendCommand(cmd, false));
            if (err || results !== 0) {
                setHomeSync(err || results);
            } else {
                setHomeSync('');
            }
        }
    };

    return ( 
        <Container class="wrapper">
            <CustomButton id="go-home" 
                onButtonClick={setSyncHomeValue}>Go Home Tracking</CustomButton>
            <CustomButton id="sync-position" 
                onButtonClick={setTrackingRateValue}>Sync Position</CustomButton>
            <ErrorMessage>{setSyncHomeValue}</ErrorMessage>                
        </Container>
    );
}
