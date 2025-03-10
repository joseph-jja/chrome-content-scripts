import React from 'react';

import CustomInput from 'js/components/base/CustomInput.jsx';
import CustomButton from 'js/components/base/CustomButton.jsx';
import ErrorMessage from 'js/components/base/ErrorMessage.jsx';

const { useState } = React;

// TODO figure out how this would work cross platform
export default function Location() {
    const [latitudeHour, setLatitudeHour] = useState(null);
    const [latitudeMinute, setLatitudeMinute] = useState(null);
    const [longitudeHour, setLongitudeHour] = useState(null);
    const [longitudeMinute, setLongitudeMinute] = useState(null);
    const [latitudeError, setLatitudeError] = useState('');    
    const [longitudeError, setLongitudeError] = useState('');
    
    const setField = (event) => {
        const fieldName = event?.target?.name;
        if (!fieldName) {
            return;
        }
        const value = event?.target?.value;
        if (!value) {
            return;
        }
        if (fieldName === latitudeHour) {
            setLatitudeHour(value);
        } else if (fieldName === latitudeMinute) {
            setLatitudeMinute(value);
        } else if (fieldName === longitudeHour) {
            setLongitudeHour(value);
        } else if (fieldName === longitudeMinute) {
            setLongitudeMinute(value);
        }
    }

    const sendSaveCommand = () => {
        let haveLat = false, haveLong = false;
        if (latitudeHour && latitudeHour.length > 0 && latitudeMinute && latitudeMinute.length > 0) {
            setLatitudeError('');
            haveLat = true;
        } else {
            setLatitudeError('Invalid latitude entered!');
        }
        if (longitudeHour && longitudeHour.length > 0 && longitudeMinute && longitudeMinute.length > 0) {
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
                <CustomInput type="text" labelText="Set Latitude Hour" size="4"
                    id="latitudeHour" name="latitudeHour" inputValue={latitudeHour}
                    onInputChange={setField}/>
                <CustomInput type="text" labelText="Minute" size="4"
                    id="latitudeMinute" name="latitudeMinute" inputValue={latitudeMinute}
                    onInputChange={setField}/>
                <ErrorMessage>{latitudeError}</ErrorMessage>
                <CustomInput type="text" labelText="Set Longitude Hour" size="4"
                    id="longitudeHour" name="longitudeHour" inputValue={longitudeHour}
                    onInputChange={setField}/>
                <CustomInput type="text" labelText="Minute" size="4"
                    id="longitudeMinute" name="longitudeMinute" inputValue={longitudeMinute}
                    onInputChange={setField}/>
                <ErrorMessage>{longitudeError}</ErrorMessage>
                <br/>
                <CustomButton id="lat-long" onButtonClick={sendSaveCommand}>Update</CustomButton>
            </div>
        </>
    )
}
            
            
            
