import React from 'react';

import CustomInput from 'js/components/base/CustomInput.jsx';
import CustomButton from 'js/components/base/CustomButton.jsx';
import ErrorMessage from 'js/components/base/ErrorMessage.jsx';

import HostConnection from 'js/components/Setup/HostConnection.jsx';

const { useState } = React;

const HOST_PORT_RE = /\d+\.\d+\.\d+\.\d+\:\d*/;

export default function Setup() {
    

    return (
        <>
            <HostConnection/>
          
        </>
    );
}
