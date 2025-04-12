import React from 'react';

import Container from 'js/components/base/Container.jsx';
import CustomInput from 'js/components/base/CustomInput.jsx';
import CustomButton from 'js/components/base/CustomButton.jsx';
import ErrorMessage from 'js/components/base/ErrorMessage.jsx';
import {
    daisyChainBooleanCommands
} from 'js/utils/commandUtils.js';
import StorageBox from "js/storage/StorageBox.js";

const { useState } = React;

const VALID_LAT_LONG_RE = /[\+|\-]?\d+\:\d+/;

// TODO figure out how this would work cross platform
export default function Location() {
    const [latitude, setLatitude] = useState(StorageBox.getItem('latitude'));
    const [longitude, setLongitude] = useState(StorageBox.getItem('longitude'));
    const [latitudeLongitudeError, setLatitudeLongitudeError] = useState('');    
    
    const setField = (event) => {
        const fieldName = event?.target?.name;
        if (!fieldName) {
            return;
        }
        const value = event?.target?.value || null;
        if (fieldName === 'latitude') {
            setLatitude(value);
            StorageBox.setItem('latitude', value);
        } else if (fieldName === 'longitude') {
            setLongitude(value);
            StorageBox.setItem('longitude', value);
        }
    }

    const sendSaveCommand = async () => {
        let haveLat = false, haveLong = false;
        if (latitude && latitude.length >= 0 && latitude.match(VALID_LAT_LONG_RE)) {
            haveLat = true;
        }
        if (longitude && longitude.length >= 0 && longitude.match(VALID_LAT_LONG_RE)) {
            haveLong = true;
        }
        if (haveLat && haveLong) {
            // send message
            // latitude => :StsDD*MM#
            // longitude => :SgDDD*MM#
            const results = await daisyChainBooleanCommands([`:Sts${latitude}#`, ':Gt#', `:Sg${longitude}#`, ':Gg#']);
            setLatitudeLongitudeError(results);
        } else {
            setLatitudeLongitudeError('Invalid latitude and / longitude or entered!');
        }
    }
    
    return (
        <Container class="wrapper">
            <CustomInput type="text" labelText="Set Latitude (+/-xxx:yyy)" size="8"
                id="latitude" name="latitude" inputValue={latitude}
                onInputChange={setField}/>
            <br/>
            <CustomInput type="text" labelText="Set Longitude (+/-xxx:yyy)" size="8"
                id="longitude" name="longitude" inputValue={longitude}
                onInputChange={setField}/>
            <br/>(NOTE: Longitude uses the opposite sign from the accepted norm, per the LX200 protocol design, so if your longitude is -150, use +150 here.)
            <ErrorMessage>{latitudeLongitudeError}</ErrorMessage>
            <br/>
            <CustomButton id="lat-long" onButtonClick={sendSaveCommand}>Set Location</CustomButton>
        </Container>
    )
}
            
            
            
