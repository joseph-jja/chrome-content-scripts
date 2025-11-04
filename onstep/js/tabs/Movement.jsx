import React from 'react';

import Container from 'js/components/base/Container.jsx';
import Directions from 'js/components/Movement/Directions.jsx';
import CollimationPosition from 'js/components/Movement/CollimationPosition.jsx';
import MovememtRates from 'js/components/Movement/MovememtRates.jsx';

export default function Movement() {
    return (
        <>
            <Directions/>
            <MovememtRates/>
            <br/>       
            <CollimationPosition/>
        </>
    );
}
