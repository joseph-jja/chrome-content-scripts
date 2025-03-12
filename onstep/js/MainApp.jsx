import React from 'react';

import CustomButton from 'js/components/base/CustomButton.jsx';
import Container from 'js/components/base/Container.jsx';
import Setup from 'js/tabs/Setup.jsx';
import Tracking from 'js/tabs/Tracking.jsx';
import Movement from 'js/tabs/Movement.jsx';

const { useState } = React;

export default function MainApp() {
    const [tabField, setTabField] = useState('setup');

    function closeApp() {
        //e.preventDefault();
        window.close();
    }

    function showSetupTag(event) {
        setTabField(event?.target?.id);
    }

    return ( 
        <>
            <CustomButton id="setup" onButtonClick={showSetupTag}>Setup</CustomButton> 
            <CustomButton id="tracking"onButtonClick={showSetupTag}>Tracking</CustomButton>
            <CustomButton id="movement"onButtonClick={showSetupTag}>Movment</CustomButton>
            <CustomButton id="close" onButtonClick={() => closeApp()}>
                Close App
            </CustomButton>
            <Container id="main-container">
                {
                    tabField === 'tracking' ? <Tracking/> :
                        tabField === 'movement' ? <Movement/> :
                        <Setup/>
                }
            </Container> 
        </>
    );
}
