import React from 'react';

import HostConnection from 'js/components/Setup/HostConnection.jsx';
import COMPortConnection from 'js/components/Setup/COMPortConnection.jsx';
import Location from 'js/components/Setup/Location.jsx';
import DateTime from 'js/components/Setup/DateTime.jsx';

// composite of components for the page
export default function Setup() {
    return (
        <>
            <HostConnection/>
            { window.electron.operatingSystem() === 'linux' ?
                <COMPortConnection/> : null }
            <Location/>
            <DateTime/>
        </>
    );
}
