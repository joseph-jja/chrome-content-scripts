import React from 'react';

export default function CustomInput(props) {

    const {
        id,
        type = "text",
        name,
        inputValue = '',
        onInputChange,
        labelText = '',
        size
    } = props;

    return (
        <>
            <label for={name}>{labelText}:&nbsp;</label>  
            <input type={type} id={id} 
                name={name} size={size}
                onChange={onInputChange} value={inputValue}/>
        </>
    );
}
