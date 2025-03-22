import React from 'react';

import Container from 'js/components/base/Container.jsx';
import Directions from 'js/components/Movement/Directions.jsx';
import SyncHome from 'js/components/Movement/SyncHome.jsx';
import CollimationPosition from 'js/components/Movement/CollimationPosition.jsx';

export default function Movement() {
    return (
        <>
            <Directions/>
            <hr/>
            <SyncHome/>
            <hr/>
            <CollimationPosition/>
        </>
    );
}
