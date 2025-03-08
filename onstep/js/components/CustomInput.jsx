import React from 'react';

export default function CustomInput(props) {

    const {
        id,
        type = "text",
        name,
        inputValue = '',
        onInputChange,
        labelText = ''
    } = props;

    return (
        <>
            <label>{labelText}:&nbsp;</label>  
            <input type={type} id={id} 
                name={name}
                onChange={onInputChange} value={inputValue}/>
        </>
    );
}