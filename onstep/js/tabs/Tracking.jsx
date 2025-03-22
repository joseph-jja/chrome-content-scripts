import React from 'react';

import ToggleTracking from 'js/components/Tracking/ToggleTracking.jsx';
import Rates from 'js/components/Tracking/Rates.jsx';

export default function Tracking() {

    return (
        <Container>
            <ToggleTracking/>
            <hr/>
            <Rates/>
        </Container>
    );
}
