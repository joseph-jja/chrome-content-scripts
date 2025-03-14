import React from 'react';

import Container from 'js/components/base/Container.jsx';
import CustomButton from 'js/components/base/CustomButton.jsx';
import ErrorMessage from 'js/components/base/ErrorMessage.jsx';
import {
    sendCommand
} from 'js/api/request.js';
import PromiseWrapper from 'js/utils/PromiseWrapper.js';
import StorageBox from "js/storage/StorageBox.js";

const { useState } = React;

// TODO figure out how this would work cross platform
export default function ToggleTracking() {
    const [trackingToggle, setTrackingToggle] = useState(StorageBox.getItem('tracking'));
    const [trackingError, setTrackingError] = useState(null);

    const setTracking = async (event) => {
        const targetId = event?.target?.id;
        let cmd;
        if (targetId === 'tracking-enable') {
            cmd = ':Te#';
            setTrackingToggle(targetId);
            StorageBox.setItem('tracking', targetId);
        } else if (targetId === 'tracking-disable') {
            cmd = ':Td#';
            setTrackingToggle(targetId);
            StorageBox.setItem('tracking', targetId);
        }
        if (cmd) {
            const [err, results] = await PromiseWrapper(sendCommand(cmd));
            if (err || results !== 0) {
                setTrackingError(err || results);
                setTrackingToggle('tracking-disable');
                StorageBox.setItem('tracking', 'tracking-disable');
            } else {
                setTrackingError('');
            }
        }
    };

    return ( 
        <Container class="wrapper">
            <CustomButton id="tracking-enable" 
                enabled={trackingToggle === 'tracking-enable'}
                onButtonClick={setTracking}>
                Enable Tracking
            </CustomButton>
            <CustomButton id="tracking-disable" 
                enabled={trackingToggle === 'tracking-disable'}
                onButtonClick={setTracking}>
                Disable Tracking
            </CustomButton>
            <ErrorMessage>{trackingError}</ErrorMessage>                
        </Container>
    );

}
