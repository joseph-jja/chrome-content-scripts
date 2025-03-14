import React from 'react';

import Container from 'js/components/base/Container.jsx';
import CustomButton from 'js/components/base/CustomButton.jsx';
import ErrorMessage from 'js/components/base/ErrorMessage.jsx';
import {
    daisyChainBooleanCommands
} from 'js/utils/commandUtils.js';
import StorageBox from "js/storage/StorageBox.js";

const { useState } = React;

// TODO figure out how this would work cross platform
export default function Rates() {
    const [trackingRate, setTrackingRate] = useState(null);
    const [trackingRateError, setTrackingRateError] = useState(null);

    const setTrackingRateValue = async (event) => {
        const targetObj = event?.target?.id;
        let cmd;
        if (targetObj === 'tracking-increase') {
            cmd = ':T+#';
            setTrackingRate(targetObj);
        } else if (targetObj === 'tracking-reset') {
            cmd = ':TR#';
            setTrackingRate(targetObj);
        } else if (targetObj === 'tracking-decrease') {
            cmd = ':T-#';
            setTrackingRate(targetObj);
        } else if (targetObj === 'tracking-solar') {
            cmd = ':TS#';
            setTrackingRate(targetObj);
        } else if (targetObj === 'tracking-lunar') {
            cmd = ':TL#';
            setTrackingRate(targetObj);
        } else if (targetObj === 'tracking-default') {
            cmd = ':TQ#';
            setTrackingRate(targetObj);
        }
        if (cmd) {
            const [err, results] = await daisyChainBooleanCommands([cmd, ':GT#']);
            if (err || results !== 0) {
                setTrackingRateError(err || results);
            } else {
                setTrackingRateError('');
            }
        }
    };

    return ( 
        <Container class="wrapper">
            <CustomButton id="tracking-increase" 
                onButtonClick={setTrackingRateValue}>Increase Tracking</CustomButton>
            <CustomButton id="tracking-reset" 
                onButtonClick={setTrackingRateValue}>Reset Tracking</CustomButton>
            <CustomButton id="tracking-decrease" 
                onButtonClick={setTrackingRateValue}>Decrease Tracking</CustomButton>
            <br/>
            <CustomButton id="tracking-default" 
                onButtonClick={setTrackingRateValue}>Tracking Default Rate</CustomButton>
            <CustomButton id="tracking-solar" 
                onButtonClick={setTrackingRateValue}>Tracking Solar Rate</CustomButton>
            <CustomButton id="tracking-lunar" 
                onButtonClick={setTrackingRateValue}>Tracking Lunar Rate</CustomButton>
            <ErrorMessage>{trackingRateError}</ErrorMessage>                
        </Container>
    );
}
