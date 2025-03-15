import React from 'react';

export default function CustomSelect(props) {

    const {
        id,
        name,
        onSelectChange,
        labelText = '',
        children,
        size
    } = props;

    return (
        <>
            <label for={name}>{labelText}:&nbsp;</label>  
            <select id={id} name={name} size={size}
                onChange={onSelectChange}>
                {children}
            </select>
        </>
    );
}


