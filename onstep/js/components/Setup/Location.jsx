import React from 'react';

import CustomInput from 'js/components/base/CustomInput.jsx';
import CustomButton from 'js/components/base/CustomButton.jsx';
import ErrorMessage from 'js/components/base/ErrorMessage.jsx';

const { useState } = React;

// TODO figure out how this would work cross platform
export default function Location() {
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [latitudeError, setLatitudeError] = useState('');    
    const [longitudeError, setLongitudeError] = useState('');
    
    const setLatitudeField = (event) => {
        setLatitude(event?.target?.value);
    }
    const setLongitudeField = (event) => {
        setLongitude(event?.target?.value);
    }

    const sendSaveCommand = () => {
        let haveLat = false, haveLong = false;
        if (latitude && latitude.length > 0) {
            setLatitudeError('');
            haveLat = true;
        } else {
            setLatitudeError('Invalid latitude entered!');
        }
        if (longitude && longitude.length > 0) {
            setLongitudeError('');
            haveLong = true;
        } else {
            setLongitudeError('Invalid longitude entered!');
        }
        if (haveLat && haveLong) {
            // send message
        }
    }
    
    return (
        <>
            <div>
                <CustomInput type="text" labelText="Set Latitude"
                    id="latitude" name="latitude" inputValue={latitude}
                    onInputChange={setLatitudeField}/>
                <ErrorMessage>{latitudeError}</ErrorMessage>
                <CustomInput type="text" labelText="Set Longitude"
                    id="host-port" name="host_port" inputValue={longitude}
                    onInputChange={setLongitudeField}/>
                <ErrorMessage>{longitudeError}</ErrorMessage>
                <br/>
                <CustomButton id="lat-long" onButtonClick={sendSaveCommand}>Update</CustomButton>
            </div>
        </>
    )
}
            
            
            
