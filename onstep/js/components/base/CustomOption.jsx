import React from 'react';

export default function CustomOption(props) {

    const {
        value,
        optionText,
        selected = false,
    } = props;

    return (
        <>
            <option value={value} selected={selected}>{optionText}</option>
        </>
    );
}


