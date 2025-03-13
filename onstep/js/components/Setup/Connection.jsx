import React from 'react';

import HostConnection from 'js/components/Setup/HostConnection.jsx';
import COMPortConnection from 'js/components/Setup/COMPortConnection.jsx';

export default function Connection() {

    return (
        <HostConnection/>
            { window.electron.operatingSystem() === 'linux' ?
                <COMPortConnection/> : null }
    );
}
