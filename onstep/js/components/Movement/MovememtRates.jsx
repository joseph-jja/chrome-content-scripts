import React from 'react';

import Container from 'js/components/base/Container.jsx';
import CustomButton from 'js/components/base/CustomButton.jsx';
import CustomFieldset from 'js/components/base/CustomFieldset.jsx';
import ErrorMessage from 'js/components/base/ErrorMessage.jsx';
import {
    sendCommand
} from 'js/api/request.js';
import StorageBox from "js/storage/StorageBox.js";

const { useState } = React;

// TODO figure out how this would work cross platform
export default function MovememtRates() {
    const [moveToggle, setMoveToggle] = useState(StorageBox.getItem('move'));
    const [moveError, setMoveError] = useState(null);

    const setMove = async (event) => {
        const targetId = event?.target?.id;
        let cmd;
        if (targetId === 'move-guide') {
            cmd = ':RG#';
            setMoveToggle(targetId);
            StorageBox.setItem('move', targetId);
        } else if (targetId === 'move-center') {
            cmd = ':RC#';
            setMoveToggle(targetId);
            StorageBox.setItem('move', targetId);
        } else if (targetObj === 'move-move') {
            cmd = ':RM#';
            setMoveToggle(targetObj);
            StorageBox.setItem('move', targetId);
        } else if (targetObj === 'move-slewe') {
            cmd = ':RS#';
            setMoveToggle(targetObj); 
            StorageBox.setItem('move', targetId);
        } else if (targetObj === 'go-home') {
            cmd = ':hC#';
            setMoveToggle(targetObj);
            StorageBox.setItem('move', targetId);
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
            <CustomFieldset legendtext="Move Rate">
                <CustomButton id="move-guide" 
                    onButtonClick={setMove}>
                    Guide
                </CustomButton>
                <CustomButton id="move-center" 
                    onButtonClick={setMove}>
                    Center
                </CustomButton>
                <CustomButton id="move-move" 
                    onButtonClick={setMove}>
                    Move
                </CustomButton>
                <CustomButton id="move-slew" 
                    onButtonClick={setMove}>
                    Slew
                </CustomButton>
            </CustomFieldset>   
            <CustomFieldset legendtext="Home">
                 <CustomButton id="go-home" 
                    onButtonClick={setMove}>Go Home</CustomButton>
            </CustomFieldset> 
            <ErrorMessage>{moveError}</ErrorMessage>                
        </Container>
    );

}
