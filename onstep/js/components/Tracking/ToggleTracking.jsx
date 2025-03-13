import React from 'react';

import CustomButton from 'js/components/base/CustomButton.jsx';
import ErrorMessage from 'js/components/base/ErrorMessage.jsx';
import {
    sendCommand
} from 'js/api/request.js';
import PromiseWrapper from 'js/utils/PromiseWrapper.js';

const { useState } = React;

// TODO figure out how this would work cross platform
export default function ToggleTracking() {
    const [trackingToggle, setTrackingToggle] = useState(null);
    const [trackingError, setTrackingError] = useState(null);

    const setTracking = async (event) => {
        const targetObj = event?.target?.id;
        let cmd;
        if (targetObj === 'tracking-enable') {
            cmd = ':Te#';
            setTrackingToggle(targetObj);
        } else if (targetObj === 'tracking-disable') {
            cmd = ':Td#';
            setTrackingToggle(targetObj);
        }
        if (cmd) {
            const [err, results] = await PromiseWrapper(sendCommand(cmd));
            if (err || results !== 0) {
                setTrackingError(err || results);
            } else {
                setTrackingError('');
            }
        }
    };

    return ( 
        <div class="wrapper">
            <CustomButton id="tracking-enable" 
                onButtonClick={setTracking}>Enable Tracking</CustomButton>
            <CustomButton id="tracking-disable" 
                onButtonClick={setTracking}>Disable Tracking</CustomButton>
            <ErrorMessage>{trackingError}</ErrorMessage>                
        </div>
    );

}