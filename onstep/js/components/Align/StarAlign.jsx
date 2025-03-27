import React from 'react';

import Container from 'js/components/base/Container.jsx';
import CustomButton from 'js/components/base/CustomButton.jsx';
import CustomSelect from 'js/components/base/CustomSelect.jsx';
import CustomOption from 'js/components/base/CustomOption.jsx';
import ErrorMessage from 'js/components/base/ErrorMessage.jsx';
import {
    sendCommand
} from 'js/api/request.js';
import PromiseWrapper from 'js/utils/PromiseWrapper.js';
import StorageBox from "js/storage/StorageBox.js";

const { useState } = React;

const STAR_ALIGN = [];
for ( let i = 1; i <= 9; i++) {
   STAR_ALIGN.push(`:A${i}#`);
}

export default function ToggleTracking() {
    const [alignmentError, setAlignmentError] = useState(null);

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
            
            <ErrorMessage>{alignmentError}</ErrorMessage>                
        </Container>
    );
}