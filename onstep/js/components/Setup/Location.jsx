import React from 'react';

import CustomInput from 'js/components/base/CustomInput.jsx';
import CustomButton from 'js/components/base/CustomButton.jsx';
import ErrorMessage from 'js/components/base/ErrorMessage.jsx';
import CustomFieldset from 'js/components/base/CustomFieldset.jsx';
import {
    daisyChainBooleanCommands
} from 'js/utils/commandUtils.js';
import StorageBox from "js/storage/StorageBox.js";

const {
    useState,
    useEffect
} = React;

const VALID_LAT_LONG_RE = /(\+|\-)?(\d)+(\:|\*|\.)(\d)+/;

// TODO figure out how this would work cross platform
export default function Location() {
    const [latitude, setLatitude] = useState(StorageBox.getItem('latitude'));
    const [longitude, setLongitude] = useState(StorageBox.getItem('longitude'));
    const [offsetField, setOffsetField] = useState(null);
    const [latitudeLongitudeError, setLatitudeLongitudeError] = useState('');    

    useEffect(() => {
        const now = new Date();
        const offset = now.getTimezoneOffset() / 60;
        if (electron?.config?.latitude) { 
            setLatitude(electron?.config?.latitude);
        }
        if (electron?.config?.longitude) { 
            if (electron?.config?.longitude.startsWith('-')) { 
                setLongitude('+' + electron?.config?.longitude.substring(1));
            } else if (electron?.config?.longitude.startsWith('+')) { 
                setLongitude('-' + electron?.config?.longitude.substring(1));
            } else {
                setLongitude('-' + electron?.config?.longitude.substring(1));
            }
        }
        if (electron?.config?.offset) { 
            setOffsetField(electron?.config?.offset);
        } else {
            setOffsetField(offset);
        }
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
            setLatitudeLongitudeError('Invalid latitude, longitude, or offset entered!');
        }
    }

    const getLatLong = async () => {
        const commands = [':Gt#', ':Gg#', ':GG#'];
        const results = await daisyChainBooleanCommands(commands);
        setLatitudeLongitudeError(results);
    }
    
    return (
            <CustomFieldset legendtext="Location">
                <CustomInput type="text" labelText="Latitude" size="10"
                    id="latitude" name="latitude" inputValue={latitude}
                    placeholderText="+/-xx*yyy"
                    onInputChange={setField}/>
                <br/>
                <br/>
                NOTE: Longitude uses the opposite sign from the accepted norm, per the LX200 protocol design, if your longitude is -150, use +150 here.
                <br/>
                <CustomInput type="text" labelText="Longitude" size="12"
                    id="longitude" name="longitude" inputValue={longitude}
                    placeholderText="+/-xxx*yyy"
                    onInputChange={setField}/>
                <br/>
                <br/>
                <CustomInput type="text" labelText="Enter UTC Offset" size="6"
                    id="offset" name="offset" inputValue={offsetField}
                    placeholderText="+/-HH"
                    onInputChange={setField}/>
                <ErrorMessage>{latitudeLongitudeError}</ErrorMessage>
                <br/>
                <CustomButton id="lat-long" onButtonClick={sendSaveCommand}>Set</CustomButton>
                <CustomButton id="get-lat-long" onButtonClick={getLatLong}>Get</CustomButton>
            </CustomFieldset>  
    );
}
            
            
            
