import React from 'react';

import Container from 'js/components/base/Container.jsx';
import CustomInput from 'js/components/base/CustomInput.jsx';
import CustomButton from 'js/components/base/CustomButton.jsx';
import ErrorMessage from 'js/components/base/ErrorMessage.jsx';
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
            Status: {storageBox.entries().map((item) => (
                item[0] !== 'onstep_options_list' ?
                   <div>{item[0]}: {item[1]}</div> :
                   null
            ))}
        </>
    );
}
