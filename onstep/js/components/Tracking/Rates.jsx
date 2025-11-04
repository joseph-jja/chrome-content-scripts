import React from 'react';

import Container from 'js/components/base/Container.jsx';
import CustomButton from 'js/components/base/CustomButton.jsx';
import ErrorMessage from 'js/components/base/ErrorMessage.jsx';
import CustomSelect from 'js/components/base/CustomSelect.jsx';
import CustomFieldset from 'js/components/base/CustomFieldset.jsx';
import CustomOption from 'js/components/base/CustomOption.jsx';
import {
    daisyChainBooleanCommands
} from 'js/utils/commandUtils.js';
import StorageBox from "js/storage/StorageBox.js";

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
            const [err, results] = await daisyChainBooleanCommands([cmd, ':GT#']);
            if (err || results !== 0) {
                setTrackingRateError(err || results);
                StorageBox.setItem('trackingRate', results);
            } else {
                setTrackingRateError('');
            }
        }
    };

    const setBacklashRateValue = async (event) => {
        const targetObj = event?.target;
        if (!targetObj) {
            return;
        }
        const cmd = targetObj.options[targetObj.selectedIndex].value.trim();
        if (cmd && cmd.length > 0) {
            const [err, results] = await PromiseWrapper(sendCommand(cmd));
            if (err || results !== 0) {
                setTrackingRateError(err || results);
            } else {
                setTrackingRateError('');
            }
        }
    };
    
    return ( 
        <>
            <Container class="wrapper">
                <CustomFieldset legendtext="Sidreal Tracking">
                    <CustomButton id="tracking-sidereal" 
                        onButtonClick={setTrackingRateValue}>Enable</CustomButton>
                    <CustomButton id="tracking-reset" 
                        onButtonClick={setTrackingRateValue}>Reset</CustomButton>
                </CustomFieldset>
                <CustomFieldset legendtext="Change Tracking Rate">
                    <CustomButton id="tracking-increase" 
                        onButtonClick={setTrackingRateValue}>Increase</CustomButton>
                    <CustomButton id="tracking-decrease" 
                        onButtonClick={setTrackingRateValue}>Decrease</CustomButton>
                </CustomFieldset>
                <CustomFieldset legendtext="Tracking Rate">
                    <CustomButton id="tracking-solar" 
                        onButtonClick={setTrackingRateValue}>Solar</CustomButton>
                    <CustomButton id="tracking-lunar" 
                        onButtonClick={setTrackingRateValue}>Lunar</CustomButton>
                    <CustomButton id="tracking-king" 
                        onButtonClick={setTrackingRateValue}>King</CustomButton>
                </CustomFieldset>
            </Container>
            <br/>
            <Container class="wrapper">
                <CustomFieldset legendtext="Backlash in ArcSec">
                    <CustomSelect id="ra-azm-backlash" name="ra_azm_backlash"
                        labelText="Set RA / Azm Amount" size="1"
                        onSelectChange={setBacklashRateValue}>
                        <CustomOption></CustomOption>
                        {TRACKING_RATE_BACKLASH?.map((item) => (
                            <CustomOption value={':$BR' + item + '#'}>
                                Rate {parseInt(item)}
                            </CustomOption>
                        ))}
                    </CustomSelect>
                    <br/>
                    <CustomSelect id="dec-alt-backlash" name="dec_alt_backlash"
                        labelText="Set Dec / Alt Amount" size="1"
                        onSelectChange={setBacklashRateValue}>
                        <CustomOption></CustomOption>
                        {TRACKING_RATE_BACKLASH?.map((item) => (
                            <CustomOption value={':$BD' + item + '#'}>
                                Rate {parseInt(item)}
                            </CustomOption>
                        ))}
                    </CustomSelect>            
                </CustomFieldset>
                <ErrorMessage>{trackingRateError}</ErrorMessage>                
            </Container>
        </>
    );
}
