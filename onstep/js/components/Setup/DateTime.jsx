import React from 'react';

import Container from 'js/components/base/Container.jsx';
import CustomInput from 'js/components/base/CustomInput.jsx';
import CustomButton from 'js/components/base/CustomButton.jsx';
import ErrorMessage from 'js/components/base/ErrorMessage.jsx';
import {
    daisyChainBooleanCommands
} from 'js/utils/commandUtils.js';

const { useState } = React;

const formatDate = (dateIn = new Date()) => {
    const month = `${dateIn.getMonth() + 1}`;
    const day = `${dateIn.getDate()}`;    
    const year = `${dateIn.getFullYear()}`;
    return `${month.padStart(2, '0')}/${day.padStart(2, '0')}/${year.substring(2)}`;
};

const formatTime = (dateIn = new Date()) => {
    const hours = `${dateIn.getHours()}`;
    const minutes = `${dateIn.getMinutes()}`;    
    const seconds = `${dateIn.getSeconds()}`;    
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
};

const DATE_RE = /\d\d\/\d\d\/\d\d/;
const TIME_RE = /\d\d:\d\d/;

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

    const setDateTime = async () => {
        if (dateField && dateField.match(DATE_RE)) {
            setDateTimeErrorField('');
            // for time we will always default
            if (!timeField || !timeField.match(TIME_RE)) {
                setTimeField(newDate);
            }
            // now we need to call fetch
            // and send to server
            // 	:SCMM/DD/YY#
            // 	:SLHH:MM:SS#
            const results = await daisyChainBooleanCommands([`:SC${dateField}#`, ':GC#', `:SL${timeField}#`, ':GL#']);
            setDateTimeErrorField(results);
        } else {
            setDateTimeErrorField('Invalid date and / or time entered!');
        }
    }
    
    return (
        <Container class="wrapper">
            <CustomInput type="text" labelText="Enter Date (MM/DD/YY)" size="12"
                id="date-field" name="date_field" inputValue={dateField}
                onInputChange={setDateFieldFromForm}/>
            <br/>
            <CustomInput type="text" labelText="Enter Time (HH:MM:SS)" size="12"
                id="time-field" name="time_field" inputValue={timeField}
                onInputChange={setTimeFieldFromForm}/>
            <ErrorMessage>{dateTimeErrorField}</ErrorMessage>
            <br/>
            <CustomButton id="date-time-fields" 
                 onButtonClick={setDateTime}>Set Date & Time</CustomButton>
        </Container>
    );
}


