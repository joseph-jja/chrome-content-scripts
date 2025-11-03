import React from 'react';

import Container from 'js/components/base/Container.jsx';
import CustomButton from 'js/components/base/CustomButton.jsx';
import ErrorMessage from 'js/components/base/ErrorMessage.jsx';
import CustomFieldset from 'js/components/base/CustomFieldset.jsx';
import {
    sendCommand
} from 'js/api/request.js';
import PromiseWrapper from 'js/utils/PromiseWrapper.js';

const { useState } = React;

// TODO figure out how this would work cross platform
export default function Directions() {
    const [direction, setDirection] = useState(null);
    const [directionError, setDirectionError] = useState(null);

    const setMovementValue = async (event) => {
        const targetObj = event?.target?.id;
        let cmd;
        if (targetObj === 'direction-north') {
            cmd = ':Qn#';
            setDirection(targetObj);
        } else if (targetObj === 'direction-south') {
            cmd = ':Qs#';
            setDirection(targetObj);
        } else if (targetObj === 'direction-east') {
            cmd = ':Qe#';
            setDirection(targetObj);
        } else if (targetObj === 'direction-west') {
            cmd = ':Qw#';
            setDirection(targetObj);
        } else if (targetObj === 'direction-west') {
            cmd = ':CM#';
            setDirection(targetObj);
        }
        if (cmd) {
            const [err, results] = await PromiseWrapper(sendCommand(cmd));
            if (err || results !== 0) {
                setDirectionError(err || results);
            } else {
                setDirectionError('');
            }
        }
    };

    return ( 
        <Container class="wrapper">
            <CustomFieldset legendtext="Movement">
                <table>
                    <tr>
                        <td>&nbsp;</td>
                        <td>
                            <CustomButton id="direction-north" 
                                onButtonClick={setMovementValue}>North</CustomButton></td>
                        <td>&nbsp;</td>
                    </tr>
                    <tr>
                        <td>
                            <CustomButton id="direction-east" 
                                onButtonClick={setMovementValue}>East</CustomButton>
                        </td>
                        <td><CustomButton id="direction-west" 
                                onButtonClick={setMovementValue}>Sync</CustomButton></td>
                        <td>
                            <CustomButton id="direction-sync" 
                                onButtonClick={setMovementValue}>West</CustomButton>
                        </td>
                    </tr>
                    <tr>
                        <td>&nbsp;</td>
                        <td>
                            <CustomButton id="direction-south" 
                                onButtonClick={setMovementValue}>South</CustomButton>
                        </td>
                        <td>&nbsp;</td>
                    </tr>
                </table>
                <ErrorMessage>{directionError}</ErrorMessage>  
            </CustomFieldset>              
        </Container>
    );
}
