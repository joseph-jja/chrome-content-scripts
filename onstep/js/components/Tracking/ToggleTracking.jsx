import React from 'react';

import Container from 'js/components/base/Container.jsx';
import CustomButton from 'js/components/base/CustomButton.jsx';
import CustomFieldset from 'js/components/base/CustomFieldset.jsx';
import ErrorMessage from 'js/components/base/ErrorMessage.jsx';
import {
    daisyChainBooleanCommands
} from 'js/utils/commandUtils.js';
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
        } else if (targetObj === 'enable-refraction-tracking') {
            cmd = ':Tr#';
            setTrackingToggle(targetObj);
            StorageBox.setItem('tracking', targetId);
        } else if (targetObj === 'disable-refraction-tracking') {
            cmd = ':Tn#';
            setTrackingToggle(targetObj); 
            StorageBox.setItem('tracking', targetId);
        } else if (targetObj === 'enable-dualaxis-tracking') {
            cmd = ':T2#';
            setTrackingToggle(targetObj); 
            StorageBox.setItem('tracking', targetId);
        } else if (targetObj === 'disable-dualaxis-tracking') {
            cmd = ':T1#';
            setTrackingToggle(targetObj); 
            StorageBox.setItem('tracking', targetId);
        }
        if (cmd) {
            const [err, results] = await daisyChainBooleanCommands([cmd, ':GT#']);
            if (err || results !== 0) {
                setTrackingError(err || results);
                setTrackingToggle('tracking-disable');
                StorageBox.setItem('tracking', 'tracking-disable');
                StorageBox.setItem('trackingRate', results);
            } else {
                setTrackingError('');
            }
        }
    };

    return ( 
        <Container class="wrapper">
            <CustomFieldset legendtext="Tracking">
                <CustomButton id="tracking-enable" 
                    enabled={trackingToggle === 'tracking-enable'}
                    onButtonClick={setTracking}>
                    Enable
                </CustomButton>
                <CustomButton id="tracking-disable" 
                    enabled={trackingToggle === 'tracking-disable'}
                    onButtonClick={setTracking}>
                    Disable
                </CustomButton>
            </CustomFieldset>
            <CustomFieldset legendtext="Refraction Rate Tracking">
                <CustomButton id="enable-refraction-tracking" 
                    onButtonClick={setTracking}>
                    Enable
                </CustomButton>
                <CustomButton id="disable-refraction-tracking" 
                    onButtonClick={setTracking}>
                    Disable
                </CustomButton>
            </CustomFieldset>
            <CustomFieldset legendtext="Dual Axis Tracking">
                <CustomButton id="enable-dualaxis-tracking" 
                    onButtonClick={setTracking}>
                    Enable
                </CustomButton>
                <CustomButton id="disable-dualaxis-tracking" 
                    onButtonClick={setTracking}>
                    Disable
                </CustomButton>
            </CustomFieldset>
            <ErrorMessage>{trackingError}</ErrorMessage>                
        </Container>
    );

}
