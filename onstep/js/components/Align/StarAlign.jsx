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
   coords.push({
       label: `Coordinates ${i}`,
       azName: `coords_${i}_az`,
       altName: `coords_${i}_alt`,
       azConvVal: `conv_${i}_az`,
       altConvVal: `conv_${i}_alt`
   });
}

export default function ToggleTracking() {
    const [alignmentError, setAlignmentError] = useState(null);
    
    useEffect(() => {
        const authCode = btoa(`${electron?.config?.ApplicationID}:${electron?.config?.SecretID}`);
        /*getStarList(authCode).then(results => {
            console.log(results);
        }).catch(e => {
            console.error(e);
        })*/
    }, []);

    const setBacklashRateValue = async (event) => {
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
                onSelectChange={setBacklashRateValue}>
                {STAR_ALIGN?.map((item) => (
                    <CustomOption value={item}>
                        Rate {item}
                    </CustomOption>
                ))}
            </CustomSelect>
            
            {coords.map(item => ( 
             <>  
             <br/>{item.label}: 
              <CustomInput type="text" labelText="Azimuth" size="18"
                    id={item.azName} name={item.azName}
                    placeholderText="+/-hh*mm*ss.s"/>
              <span id={item.AzConvVal}></span> 
              <CustomInput type="text" labelText="Altitude" size="18"
                    id={item.altName} name={item.altName}
                    placeholderText="+/-hh*mm*ss.s"/>
              <span id={item.altConvVal}></span> 
             </>        
            ))}

            <ErrorMessage>{alignmentError}</ErrorMessage>                
        </Container>
    );
}
