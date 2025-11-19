import React from 'react';

import Container from 'js/components/base/Container.jsx';
import CustomInput from 'js/components/base/CustomInput.jsx';
import CustomButton from 'js/components/base/CustomButton.jsx';
import CustomFieldset from 'js/components/base/CustomFieldset.jsx';
import CustomSelect from 'js/components/base/CustomSelect.jsx';
import CustomOption from 'js/components/base/CustomOption.jsx';
import ErrorMessage from 'js/components/base/ErrorMessage.jsx';
import {
    sendCommand,
    getStarList
} from 'js/api/request.js';
import PromiseWrapper from 'js/utils/PromiseWrapper.js';
import StorageBox from "js/config.js";
import {
   ASTRONOMY_API
} from 'js/storage/StorageBox.js';

const {
    useState,
    useEffect
} = React;

const STAR_ALIGN = [];
const coords = [];
for ( let i = 1; i <= 9; i++) {
   STAR_ALIGN.push(`:A${i}#`);
}

export default function ToggleTracking() {
    const [alignmentError, setAlignmentError] = useState(null);
    const [azimuth, setAzimuth] = useState('');
    const [altitude, setAltitude] = useState('');
       
    const setAzimuthField = (event) => {
        const fieldName = event?.target?.name;
        if (!fieldName) {
            return;
        }
        const value = event?.target?.value || null;
        setAzimuth( value );
    };

    const setAltitudeField = (event) => {
        const fieldName = event?.target?.name;
        if (!fieldName) {
            return;
        }
        const value = event?.target?.value || null;
        setAltitude( value );
    };
    
    const searchLocation = (event) => {
        const authCode = btoa(`${electron?.config?.ApplicationID}:${electron?.config?.SecretID}`);
        /*getStarList(authCode).then(results => {
            console.log(results);
        }).catch(e => {
            console.error(e);
        })*/
    };

    const setAlignNumberValue = async (event) => {
        const targetObj = event?.target;
        if (!targetObj) {
            return;
        }
        const cmd = targetObj.options[targetObj.selectedIndex].value.trim();
        if (cmd && cmd.length > 0) {
            const [err, results] = await PromiseWrapper(sendCommand(cmd));
            if (err || results !== 0) {
                setAlignmentError(err || results);
            } else {
                setAlignmentError('');
            }
        }
    };
    
    // 	:AW# - save align
    // 	:Ax# - align x stars
    //  :A+# - accept
    return (
        <Container class="wrapper">

            <CustomSelect id="pick-star" name="pick_star"
                labelText="Pick Number of Stars"
                onSelectChange={setAlignNumberValue}>
                {STAR_ALIGN?.map((item) => (
                    <CustomOption value={item}>
                        Rate {item}
                    </CustomOption>
                ))}
            </CustomSelect>
            
            <br/>Search Coordinate: 
              <br/>
              <CustomInput type="text" labelText="Azimuth" size="18"
                    id="azimuth" name="azimuth" inputValue={azimuth}
                    placeholderText="+/-hh*mm*ss.s"
                    onInputChange={setAzimuthField}/>
              <span id="azimuth_converted"></span>
              <br/> 
              <CustomInput type="text" labelText="Altitude" size="18"
                    id="altitude" name="altitude" inputValue={altitude}
                    placeholderText="+/-hh*mm*ss.s"
                    onInputChange={setAltitudeField}/>
              <span id="altitude_converted"></span> 
              <br/> 
              <CustomButton id="Search Coordinates" onButtonClick={searchLocation}>Set</CustomButton>
            <ErrorMessage>{alignmentError}</ErrorMessage>                
        </Container>
    );
}
