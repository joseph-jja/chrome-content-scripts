import React from 'react';

import Connection from 'js/components/Setup/Connection.jsx';
import Location from 'js/components/Setup/Location.jsx';
import DateTime from 'js/components/Setup/DateTime.jsx';

// composite of components for the page
export default function Setup() {
    return (
        <Container>
            <Connection/>
            <hr/>
            <Location/>
            <hr/>
            <DateTime/>
        </Container>
    );
}
