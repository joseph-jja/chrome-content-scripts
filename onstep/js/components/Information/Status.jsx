import React from 'react';

import Container from 'js/components/base/Container.jsx';
import CustomInput from 'js/components/base/CustomInput.jsx';
import CustomButton from 'js/components/base/CustomButton.jsx';
import ErrorMessage from 'js/components/base/ErrorMessage.jsx';
import {
    daisyChainBooleanCommands
} from 'js/utils/commandUtils.js';
import StorageBox from "js/storage/StorageBox.js";

const {
    useState,
    useSyncExternalStore
} = React;

export default function Status() {
    const storageBox = useSyncExternalStore(StorageBox.subscribe, StorageBox.getSnapshot);
    console.log({ storageBox });

    return (
        <>
            Connected: { storageBox }
        </>
    );
}
