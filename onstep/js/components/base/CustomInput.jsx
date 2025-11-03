import React from 'react';

export default function CustomInput(props) {

    const {
        id,
        type = "text",
        name,
        inputValue = '',
        onInputChange,
        defaultChecked,
        placeholderText = '',
        labelText = '',
        size
    } = props;

    return (
        <>
            <label for={name}>{labelText}:&nbsp;</label>  
            <input type={type} id={id} 
                name={name} size={size}
                defaultChecked={defaultChecked}
                placeholder={placeholderText}
                onChange={onInputChange} value={inputValue}/>
        </>
    );
}
