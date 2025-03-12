import React from 'react';

import CustomInput from 'js/components/base/CustomInput.jsx';
import CustomButton from 'js/components/base/CustomButton.jsx';
import ErrorMessage from 'js/components/base/ErrorMessage.jsx';
import {
    sendCommand
} from 'js/api/request.js';
import PromiseWrapper from 'js/utils/PromiseWrapper.js';

const { useState } = React;

const VALID_LAT_LONG_RE = /[\+|\-]?\d+\:\d+/;

// TODO figure out how this would work cross platform
export default function Location() {
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [latitudeError, setLatitudeError] = useState('');    
    const [longitudeError, setLongitudeError] = useState('');
    
    const setField = (event) => {
        const fieldName = event?.target?.name;
        if (!fieldName) {
            return;
        }
        const value = event?.target?.value || null;
        if (fieldName === 'latitude') {
            setLatitude(value);
        } else if (fieldName === 'longitude') {
            setLongitude(value);
        }
    }

    const sendSaveCommand = async () => {
        let haveLat = false, haveLong = false;
        if (latitude && latitude.length >= 0 && latitude.match(VALID_LAT_LONG_RE)) {
            setLatitudeError('');
            haveLat = true;
        } else {
            setLatitudeError('Invalid latitude entered!');
        }
        if (longitude && longitude.length >= 0 && longitude.match(VALID_LAT_LONG_RE)) {
            setLongitudeError('');
            haveLong = true;
        } else {
            setLongitudeError('Invalid longitude entered!');
        }
        if (haveLat && haveLong) {
            // send message
            // latitude => :StsDD*MM#
            // longitude => :SgDDD*MM#
            const [latErr, latResults] = await PromiseWrapper(sendCommand(`:Sts${latitude}#`));
            if (latResults && latResults === 0) {
                const [longErr, longResults] = await PromiseWrapper(sendCommand(`:Sg${longitude}#`));
                if (!longResults || longResults !== 0) {
                    setLongitudeError(longErr || longResults);
                }
            } else {
                setLatitudeError(latErr || latResults);
            }
        }
    }
    
    return (
        <>
            <div>
                <CustomInput type="text" labelText="Set Latitude (xxx:yyy)" size="8"
                    id="latitude" name="latitude" inputValue={latitude}
                    onInputChange={setField}/>
                <ErrorMessage>{latitudeError}</ErrorMessage>
                <CustomInput type="text" labelText="Set Longitude (+/-xxx:yyy)" size="8"
                    id="longitude" name="longitude" inputValue={longitude}
                    onInputChange={setField}/>
                <ErrorMessage>{longitudeError}</ErrorMessage>
                <br/>
                <CustomButton id="lat-long" onButtonClick={sendSaveCommand}>Set Latitude and Longitude</CustomButton>
            </div>
        </>
    )
}
            
            
            
