import React from 'react';

import Container from 'js/components/base/Container.jsx';
import CustomCommand from 'js/components/Advanced/CustomCommand.jsx';
import AllCommandsList from 'js/components/Advanced/AllCommandsList.jsx';

export default function Tracking() {
    
    return (
        <>
            <CustomCommand/>
            <hr/>
            <AllCommandsList/>
        </>
    );
}
