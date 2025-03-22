import React from 'react';

import Connection from 'js/components/Setup/Connection.jsx';
import Location from 'js/components/Setup/Location.jsx';
import DateTime from 'js/components/Setup/DateTime.jsx';
import Container from 'js/components/base/Container.jsx';

// composite of components for the page
export default function Setup() {
    return (
        <>
            <Connection/>
            <hr/>
            <Location/>
            <hr/>
            <DateTime/>
        </>
    );
}
