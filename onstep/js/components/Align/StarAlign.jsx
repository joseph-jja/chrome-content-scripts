import React from 'react';

import Container from 'js/components/base/Container.jsx';
import CustomButton from 'js/components/base/CustomButton.jsx';
import ErrorMessage from 'js/components/base/ErrorMessage.jsx';
import {
    sendCommand
} from 'js/api/request.js';
import PromiseWrapper from 'js/utils/PromiseWrapper.js';
import StorageBox from "js/storage/StorageBox.js";

const { useState } = React;

export default function ToggleTracking() {
    const [alignmentError, setAlignmentError] = useState(StorageBox.getItem(null));


    return (
        <Container class="wrapper">
        food food

            <ErrorMessage>{alignmentError}</ErrorMessage>                
        </Container>
    );
}