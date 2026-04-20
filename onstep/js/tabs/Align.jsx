import React from 'react';

import Container from 'js/components/base/Container.jsx';
import StarAlign from 'js/components/Align/StarAlign.jsx';
import Directions from 'js/components/Movement/Directions.jsx';

// composite of components for the page
export default function Align() {
    return (
        <Container class="wrapper">
            <StarAlign/>
                        <Directions/>

        </Container>
    );
}