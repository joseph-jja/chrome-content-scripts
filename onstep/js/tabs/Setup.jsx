import React from 'react';

import HostConnection from 'js/components/Setup/HostConnection.jsx';
import PortConnection from 'js/components/Setup/PortConnection.jsx';
import Location from 'js/components/Setup/Location.jsx';
import DateTime from 'js/components/Setup/DateTime.jsx';

// composite of components for the page
export default function Setup() {
    return (
        <>
            <HostConnection/>
            { window.electron.operatingSystem() === 'linux' ?
                <PortConnection/> : null }
            <Location/>
            <DateTime/>
        </>
    );
}
