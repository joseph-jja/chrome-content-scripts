import React from 'react';

import CustomCommand from 'js/components/Advanced/CustomCommand.jsx';
import CustomSelect from 'js/components/base/CustomSelect.jsx';

export default function Tracking() {


    const selectionFieldChange = (event) => {
    
    
    }

    return (
        <>
            <CustomCommand/>
            <CustomSelect id="all-options" name="all_options"
                labelText="All Commands" size="10"
                onSelectChange={selectionFieldChange}></CustomSelect>
        </>
    );
}
