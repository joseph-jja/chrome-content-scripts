import React from 'react';

import CustomCommand from 'js/components/Advanced/CustomCommand.jsx';
import CustomSelect from 'js/components/base/CustomSelect.jsx';
import CustomOption from 'js/components/base/CustomOption.jsx';
import {
    getCommandList
} from 'js/api/request.js';
import StorageBox from "js/storage/StorageBox.js";

const {
    useSyncExternalStore,
    useEffect,
    useState
} = React;

const ONSTEP_OPTIONS_LIST_NAME = 'onstep_options_list';

export default function Tracking() {
    const storageBox = useSyncExternalStore(StorageBox.subscribe, StorageBox.getSnapshot);
    const [options, setOptions] = useState(null);
    
    const selectionFieldChange = (event) => {
    
    
    }
    
    useEffect(() => {
        let apiData = StorageBox.getItem(ONSTEP_OPTIONS_LIST_NAME);
        if (!apiData) {
            getCommandList().then(results => {
                try {
                    apiData = JSON.parse(results);
                    //StorageBox.setItem(ONSTEP_OPTIONS_LIST_NAME, apiData);
                } catch(err) {
                    console.error(err);
                }
            }).catch(e => {
                  console.error(e);
            });
        }
        return () => {};
    }, []);

    return (
        <>
            <CustomCommand/>
            <CustomSelect id="all-options" name="all_options"
                labelText="All Commands" size="10"
                onSelectChange={selectionFieldChange}></CustomSelect>
        </>
    );
}
