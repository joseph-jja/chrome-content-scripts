import React from 'react';

import CustomButton from 'js/components/base/CustomButton.jsx';
import Container from 'js/components/base/Container.jsx';
import Setup from 'js/tabs/Setup.jsx';
import Tracking from 'js/tabs/Tracking.jsx';
import Movement from 'js/tabs/Movement.jsx';
import Advanced from 'js/tabs/Advanced.jsx';
import Status from 'js/components/Information/Status.jsx';
import Align from 'js/tabs/Align.jsx';
import StorageBox from "js/storage/StorageBox.js";

const {
    useState,
    useSyncExternalStore
} = React;

export default function MainApp() {
    const storageBox = useSyncExternalStore(StorageBox.subscribe, StorageBox.getSnapshot);
    const [tabField, setTabField] = useState('setup');

    function closeApp() {
        window.close();
    }

    function showSetupTag(event) {
        setTabField(event?.target?.id);
    }

    return ( 
        <>
            <CustomButton id="setup" 
                enabled={tabField === 'setup'}
                onButtonClick={showSetupTag}>Setup</CustomButton> 
            <CustomButton id="tracking"
                enabled={tabField === 'tracking'}
                onButtonClick={showSetupTag}>Tracking</CustomButton>
            <CustomButton id="movement"
                enabled={tabField === 'movement'}
                onButtonClick={showSetupTag}>Movement</CustomButton>
            <CustomButton id="align"
                enabled={tabField === 'align'}
                onButtonClick={showSetupTag}>Align</CustomButton>
            <CustomButton id="advanced"
                enabled={tabField === 'advanced'}
                onButtonClick={showSetupTag}>Advanced</CustomButton>
            
            {/*<CustomButton id="close" onButtonClick={() => closeApp()}>
                Close App
            </CustomButton>*/}
            <Container id="main-container">
                {
                    tabField === 'tracking' ? <Tracking/> :
                        tabField === 'advanced' ? <Advanced/> :
                        tabField === 'movement' ? <Movement/> :
                        tabField === 'align' ? <Align/> :
                        <Setup/>
                }
            </Container> 
            <Container id="info-container">
                <Status/>
            </Container> 
        </>
    );
}
