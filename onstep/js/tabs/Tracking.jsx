import React from 'react';

import ToggleTracking from 'js/components/Tracking/ToggleTracking.jsx';
import Rates from 'js/components/Tracking/Rates.jsx';
import Container from 'js/components/base/Container.jsx';

export default function Tracking() {

    return (
        <Container>
            <ToggleTracking/>
            <hr/>
            <Rates/>
        </Container>
    );
}
