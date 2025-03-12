import React from 'react';

import CustomButton from 'js/components/base/CustomButton.jsx';
import ErrorMessage from 'js/components/base/ErrorMessage.jsx';

const { useState } = React;

// TODO figure out how this would work cross platform
export default function ToggleTracking() {
    const [trackingToggle, setTrackingToggle] = useState(null);
    const [trackingError, setTrackingError] = useState(null);

    const setTracking = (event) => {
        
    };

    return ( 
        <div>
            <CustomButton id="tracking-enable" 
                onButtonClick={setTracking}>Enable Tracking</CustomButton>
            <CustomButton id="tracking-disnable" 
                onButtonClick={setTracking}>Disable Tracking</CustomButton>
            <ErrorMessage>{trackingError}</ErrorMessage>                
        </div>
    );

}