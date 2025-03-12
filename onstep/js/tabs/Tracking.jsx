import React from 'react';

import ToggleTracking from 'js/components/Tracking/ToggleTracking.jsx';
import Rates from 'js/components/Tracking/Rates.jsx';
import Information from 'js/components/Tracking/Information.jsx';

export default function Tracking() {

    return (
        <>
            <ToggleTracking/>
            <Rates/>
            <Information/>
        </>
    );
}
