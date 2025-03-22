import React from 'react';

import Container from 'js/components/base/Container.jsx';
import CustomCommand from 'js/components/Advanced/CustomCommand
import AllCommandsList from 'js/components/Advanced/AllCommandsList.jsx';

export default function Tracking() {
    
    return (
        <Container>
            <CustomCommand/>
            <hr/>
            <AllCommandsList/>
        </Container>
    );
}
