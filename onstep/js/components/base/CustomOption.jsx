import React from 'react';

export default function CustomOption(props) {

    const {
        value,
        children,
        selected = false,
    } = props;

    return (
        <>
            <option value={value} selected={selected}>{children}</option>
        </>
    );
}


