import React from 'react';

import Container from 'js/components/base/Container.jsx';
import CustomButton from 'js/components/base/CustomButton.jsx';
import ErrorMessage from 'js/components/base/ErrorMessage.jsx';
import CustomFieldset from 'js/components/base/CustomFieldset.jsx';
import CustomInput from 'js/components/base/CustomInput.jsx';
import {
    daisyChainBooleanCommands
} from 'js/utils/commandUtils.js';
import StorageBox from "js/storage/StorageBox.js";

const {
    useState
} = React;

// TODO figure out how this would work cross platform
export default function Rates() {
    const [trackingRate, setTrackingRate] = useState(null);
    const [trackingRateError, setTrackingRateError] = useState(null);
    const [raBacklash, setRaBacklash] = useState(null);
    const [decBacklash, setDecBacklash] = useState(null);
    const [backlashError, setBacklashError] = useState(null);
    const [raRate, setRaRate] = useState(null);
    const [decRate, setDecRate] = useState(null);
    const [rateError, setRateError] = useState(null);

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
            const [err, results] = await daisyChainBooleanCommands([{
                    command: cmd,
                    isBoolean: false,
                    hasResponse: false
                },
                {
                    command: ':GT#',
                    isBoolean: false,
                    hasResponse: true,
                    terminatorCharacter: '#'
                }
            ]);
            if (err || results !== 0) {
                setTrackingRateError(err || results);
                StorageBox.setItem('trackingRate', results);
            } else {
                setTrackingRateError('');
            }
        }
    };

    const setField = (event) => {
        const fieldName = event?.target?.name;
        const value = event?.target?.value || null;
        if (!fieldName || !value) {
            return;
        }
        
        if (fieldName === 'dec_alt_backlash') {
            setDecBacklash(fieldValue);
        } else if (fieldName === 'ra_azm_backlash') {
            setRaBacklash(fieldValue);
        } else if (fieldName === 'ra_azm_rate') {
            setRaRate(fieldValue);
        } else if (fieldName === 'dec_alt_rate') {
            setDecRate(fieldValue);
        }
    };
        
    const updateBacklash = async (event) => {
        const commands = [];
        if (raBacklash) {
            commands.push({
              ':$BR' + raBacklash + '#',
                isBoolean: true,
                hasResponse: true
            });
        }
        if (decBacklash) {
            commands.push({
              ':$BD' + decBacklash + '#',
                isBoolean: true,
                hasResponse: true
            });
        }

        commands.push({
            command: ':%BD#',
            isBoolean: false, 
            hasResponse: true
        });
        commands.push({
            command: ':%BR#',
            isBoolean: false, 
            hasResponse: true
        });
        const [err, results] = await daisyChainBooleanCommands(commands);
        setBacklashError(err || results || '');  
    };

    const updateTrackingRates = async (event) => {
        const commands = [];
        if (raRate) {
            commands.push({
              `:SXTR,{raBacklash}#`,
                isBoolean: true,
                hasResponse: true
            });
        }
        if (decRate) {
            commands.push({
                `:SXTD,{decBacklash}#`,
                isBoolean: true,
                hasResponse: true
            });
        }

        commands.push({
            command: ':GXTR#',
            isBoolean: false, 
            hasResponse: true
        });
        commands.push({
            command: ':GXTD#',
            isBoolean: false, 
            hasResponse: true
        });
        const [err, results] = await daisyChainBooleanCommands(commands);
        setRateError(err || results || '');
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
                    <CustomInput type="text" labelText="Set RA / Azm Amount" size="6"
                        id="ra_azm_backlash" name="ra_azm_backlash"
                        inputValue={raBacklash}
                        placeholderText="0"
                        onInputChange={setField}/>
                    <CustomButton id="right-ascention" 
                        onButtonClick={setField}>Set RA Backlash</CustomButton>
                    <br/>
                    <CustomInput type="text" labelText="Set Dec / Alt Amount" size="6"
                        id="dec_alt_backlash" name="dec_alt_backlash"
                        inputValue={decBacklash}
                        placeholderText="0"
                        onInputChange={setField}/>
                    <CustomButton id="declination" 
                        onButtonClick={updateBacklash}>Set Dec Backlash</CustomButton>
                    <ErrorMessage>{backlashError}</ErrorMessage>                
                </CustomFieldset>
                <CustomFieldset legendtext="Tracking Rate Offset">
                    <CustomInput type="text" labelText="Set RA / Azm Rate" size="6"
                        id="ra_azm_rate" name="ra_azm_rate"
                        inputValue={raRate}
                        placeholderText="0.0"
                        onInputChange={setField}/>
                    <CustomButton id="right-ascention-rate" 
                        onButtonClick={setField}>Set RA Tracking Rate</CustomButton>
                    <br/>
                    <CustomInput type="text" labelText="Set Dec / Alt Rate" size="6"
                        id="dec_alt_rate" name="dec_alt_rate"
                        inputValue={decRate}
                        placeholderText="0.0"
                        onInputChange={setField}/>
                    <CustomButton id="declination-rate" 
                        onButtonClick={updateTrackingRates}>Set Dec Tracking Rate</CustomButton>
                    <ErrorMessage>{rateError}</ErrorMessage>                
                </CustomFieldset>
            </Container>
        </>
    );
}
