import React from 'react';

import CustomButton from 'js/components/base/CustomButton.jsx';
import ErrorMessage from 'js/components/base/ErrorMessage.jsx';

const { useState } = React;

// TODO figure out how this would work cross platform
export default function Rates() {
    const [trackingRate, setTrackingRate] = useState(null);
    //const [trackingError, setTrackingError] = useState(null);

    const setTrackingRateValue = (event) => {
        
    };

    //        <ErrorMessage>{trackingError}</ErrorMessage>                
    return ( 
        <div>
            <CustomButton id="tracking-increase" 
                onButtonClick={setTrackingRateValue}>Increase Tracking</CustomButton>
            <CustomButton id="tracking-reset" 
                onButtonClick={setTrackingRateValue}>Reset Tracking</CustomButton>
            <CustomButton id="tracking-disable" 
                onButtonClick={setTrackingRateValue}>Decrease Tracking</CustomButton>
        </div>
    );
}