import React from 'react';

import Container from 'js/components/base/Container.jsx';
import CustomInput from 'js/components/base/CustomInput.jsx';
import CustomButton from 'js/components/base/CustomButton.jsx';
import ErrorMessage from 'js/components/base/ErrorMessage.jsx';
import {
    daisyChainBooleanCommands
} from 'js/utils/commandUtils.js';
import StorageBox from "js/storage/StorageBox.js";

const {
    useState,
    useEffect
} = React;

const VALID_LAT_LONG_RE = /[\+|\-]\d+\:\d+/;

// TODO figure out how this would work cross platform
export default function Location() {
    const [latitude, setLatitude] = useState(StorageBox.getItem('latitude'));
    const [longitude, setLongitude] = useState(StorageBox.getItem('longitude'));
    const [offsetField, setOffsetField] = useState(null);
    const [latitudeLongitudeError, setLatitudeLongitudeError] = useState('');    

    useEffect(() => {
        const now = new Date();
        const offset = now.getTimezoneOffset() / 60;
        setOffsetField(offset);
    }, []);
    
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
        } else if (fieldName === 'offset') {
            setOffsetField(value);
            StorageBox.setItem('offset', value);
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
            const commands = [`:St${latitude.replace(':', '*')}#`, ':Gt#', `:Sg${longitude.replace(':', '*')}#`, ':Gg#', ':GG#'];
            if (offsetField) {
                commands.push(`:SG${offsetField}#`);
                commands.push(':GG#');
            }
            const results = await daisyChainBooleanCommands(commands);
            setLatitudeLongitudeError(results);
        } else {
            setLatitudeLongitudeError('Invalid latitude and / longitude or entered!');
        }
    }

    const getLatLong = async () => {
        const commands = [':Gt#', ':Gg#', ':GG#'];
        const results = await daisyChainBooleanCommands(commands);
        setLatitudeLongitudeError(results);
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
            <br/>
            <CustomInput type="text" labelText="Enter UTC Offset (+/-HH)" size="6"
                id="offset" name="offset" inputValue={offsetField}
                onInputChange={setField}/>
            <ErrorMessage>{latitudeLongitudeError}</ErrorMessage>
            <br/>
            <CustomButton id="lat-long" onButtonClick={sendSaveCommand}>Set Location</CustomButton>
            <CustomButton id="get-lat-long" onButtonClick={getLatLong}>Get Location</CustomButton>
        </Container>
    )
}
            
            
            
