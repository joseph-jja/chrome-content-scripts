import React from 'react';

import CustomSelect from 'js/components/base/CustomSelect.jsx';
import CustomOption from 'js/components/base/CustomOption.jsx';
import {
    getCommandList
} from 'js/api/request.js';
import StorageBox from "js/storage/StorageBox.js";
import { 
    safeParse,
    safeStringify
} from 'js/utils/jsonUtils.js';

const {
    useSyncExternalStore,
    useEffect,
    useState
} = React;

const ONSTEP_OPTIONS_LIST_NAME = 'onstep_options_list';

function useCommandList() {
    const storageBox = useSyncExternalStore(StorageBox.subscribe, StorageBox.getSnapshot);
    const [data, setData] = useState(null);
    useEffect(() => {
        const apiData = storageBox.get(ONSTEP_OPTIONS_LIST_NAME);
        if (!apiData) {
            getCommandList().then(results => {
                const optionData = safeParse(results);
                const formattedData = Object.keys(optionData).map(key => {
                    return {
                        key: key,
                        data: optionData[key]
                    };
                });
                setData(formattedData);
                storageBox.set(ONSTEP_OPTIONS_LIST_NAME, safeStringify(formattedData));
            }).catch(e => console.error(e));
        } else {
                setData(safeParse(apiData));
        }
    }, []);
    return data;
}

export default function AllCommandsList() {
    const [options, setOptions] = useState(null);
    const data = useCommandList(); 
    
    const selectionFieldChange = (event) => {
    
    
    }

    return (
        <CustomSelect id="all-options" name="all_options"
                labelText="All Commands" size="10"
                onSelectChange={selectionFieldChange}>
                {data?.map((item) => (
                    <CustomOption value={item?.key}>
                        {item?.data?.description}&nbsp;&nbsp;
                        {item?.key}&nbsp;&nbsp;
                        {item?.data?.reply}
                    </CustomOption>
                ))}
            </CustomSelect>
    )
}

