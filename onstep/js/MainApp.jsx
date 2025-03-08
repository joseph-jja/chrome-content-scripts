import React from 'react';

import CustomButton from 'js/components/CustomButton.jsx';
import Container from 'js/components/Container.jsx';
import Setup from 'js/tabs/Setup.jsx';

export default function MainApp() {

    function closeApp() {
        //e.preventDefault();
        window.close();
    }

    function showSetupTag() {

    }

    return ( 
        <>
            <CustomButton id="setup">Setup</CustomButton> 
            <CustomButton id="tracking">Tracking</CustomButton>
            <CustomButton id="movement">Movment</CustomButton>
            <CustomButton id="close" onButtonClick={() => closeApp()}>
                Close App
            </CustomButton>
            <Container id="main-container">
                <Setup/>
            </Container> 
        </>
    );
}