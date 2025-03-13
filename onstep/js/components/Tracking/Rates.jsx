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
        }
        if (cmd) {
            const [err, results] = await PromiseWrapper(sendCommand(cmd));
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
            <ErrorMessage>{trackingRateError}</ErrorMessage>                
        </Container>
    );
}
