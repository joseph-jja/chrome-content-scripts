import React from 'react';

import CustomInput from 'js/components/base/CustomInput.jsx';
import CustomButton from 'js/components/base/CustomButton.jsx';
import ErrorMessage from 'js/components/base/ErrorMessage.jsx';

const { useState } = React;

const formatDate = (dateIn = new Date()) => {
    const month = `${dateIn.getMonth() + 1}`;
    const day = `${dateIn.getDay()}`;    
    const year = `${dateIn.getFullYear()}`;
    return `${month.padStart(2, '0')}/${day.padStart(2, '0')}/${year.substring(2)}`;
};

const formatTime = (dateIn = new Date()) => {
    const hours = `${dateIn.getHours() + 1}`;
    const minutes = `${dateIn.getMinutes()}`;    
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
};

export default function DateTime() {
    const [dateField, setDateField] = useState(formatDate(new Date()));
    const [timeField, setTimeField] = useState(formatTime(new Date()));
    const [dateTimeErrorField, setDateTimeErrorField] = useState(null);

    const setDateFieldFromForm = (event) => {
        const value = event?.target?.value;
        setDateField(value);
    }

    const setTimeFieldFromForm = (event) => {
        const value = event?.target?.value;
        setTimeField(value);
    }

    const setDateTime = () => {
        if (dateField && timeField) {
            setDateTimeErrorField('');
            // now we need to call fetch
            // and send to server
        } else {
            setDateTimeErrorField('Invalid date and / or time entered!');
        }
    }
    
    return (
        <>
            <div>
                <CustomInput type="text" labelText="Enter Date (MM/DD/YY)"
                    id="date-field" name="date_field" inputValue={dateField}
                    onInputChange={setDateFieldFromForm}/>
                <CustomInput type="text" labelText="Enter Time (MM/DD/YY)"
                    id="time-field" name="time_field" inputValue={timeField}
                    onInputChange={setTimeFieldFromForm}/>
                <ErrorMessage>{dateTimeErrorField}</ErrorMessage>
                <br/>
                <CustomButton id="host-setup" 
                    onButtonClick={setDateTime}>Set Date & Time</CustomButton>
            </div>
        </>
    );
}


