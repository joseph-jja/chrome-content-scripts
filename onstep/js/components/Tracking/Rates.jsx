import React from 'react';

import Container from 'js/components/base/Container.jsx';
import CustomButton from 'js/components/base/CustomButton.jsx';
import ErrorMessage from 'js/components/base/ErrorMessage.jsx';
import CustomSelect from 'js/components/base/CustomSelect.jsx';
import CustomOption from 'js/components/base/CustomOption.jsx';
import {
    sendCommand
} from 'js/api/request.js';
import PromiseWrapper from 'js/utils/PromiseWrapper.js';

const { useState } = React;

const TRACKING_RATE_BACKLASH = [];
for ( let i = 2; i <= 50; i++) {
   TRACKING_RATE_BACKLASH.push(`${i}`.padStart(3, '0'));
}

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
        } else if (targetObj === 'tracking-king') {
            cmd = ':TK#';
            setTrackingRate(targetObj);
        } else if (targetObj === 'tracking-sidereal') {
            cmd = ':TQ#';
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
    
    const setTrackingRateValueWithResponse = async (event) => {
        const targetObj = event?.target?.id;
        let cmd;
        if (targetObj === 'enable-refraction-tracking') {
            cmd = ':Tr#';
            setTrackingRate(targetObj);
        } else if (targetObj === 'disable-refraction-tracking') {
            cmd = ':Tn#';
            setTrackingRate(targetObj);
                        
        }
        
        const [err, results] = await PromiseWrapper(sendCommand(cmd));
            if (err || results !== 0) {
                setTrackingRateError(err || results);
            } else {
                setTrackingRateError('');
            }
    }

    return ( 
        <Container class="wrapper">
            <CustomButton id="tracking-sidereal" 
                onButtonClick={setTrackingRateValue}>Track Default Sidereal Tracking</CustomButton>
            <CustomButton id="tracking-reset" 
                onButtonClick={setTrackingRateValue}>Reset Sidereal Tracking</CustomButton>
            <hr/>
            <CustomButton id="tracking-increase" 
                onButtonClick={setTrackingRateValue}>Increase Tracking</CustomButton>
            <CustomButton id="tracking-decrease" 
                onButtonClick={setTrackingRateValue}>Decrease Tracking</CustomButton>
            <CustomButton id="tracking-solar" 
                onButtonClick={setTrackingRateValue}>Tracking Solar Rate</CustomButton>
            <CustomButton id="tracking-lunar" 
                onButtonClick={setTrackingRateValue}>Tracking Lunar Rate</CustomButton>
            <CustomButton id="tracking-king" 
                onButtonClick={setTrackingRateValue}>Tracking King Rate</CustomButton>
            <hr/>
            <CustomSelect id="ra-azm-backlash" name="ra_azm_backlash"
                labelText="Set RA (Azm) backlash amount (in ArcSec)" size="1"
                onSelectChange={setTrackingRateValue}>
                {TRACKING_RATE_BACKLASH?.map((item) => (
                    <CustomOption value={item}>
                        {item}
                    </CustomOption>
                ))}
            </CustomSelect>
            <br/>
            <CustomSelect id="dec-alt-backlash" name="dec_alt_backlash"
                labelText="Set Dec (Alt) backlash amount (in ArcSec)" size="1"
                onSelectChange={setTrackingRateValue}>
                {TRACKING_RATE_BACKLASH?.map((item) => (
                    <CustomOption value={item}>
                        {item}
                    </CustomOption>
                ))}
            </CustomSelect>
            
            <hr/>
            <CustomButton id="enable-refraction-tracking" 
                onButtonClick={setTrackingRateValueWithResponse}>Tracking Refraction Rate Enable</CustomButton>
            <CustomButton id="disable-refraction-tracking" 
                onButtonClick={setTrackingRateValueWithResponse}>Tracking Refraction Rate Disable</CustomButton>
            <ErrorMessage>{trackingRateError}</ErrorMessage>                
        </Container>
    );
}
