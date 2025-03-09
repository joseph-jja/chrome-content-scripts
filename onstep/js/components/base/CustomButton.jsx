import React from 'react';

export default function CustomButton(props) {

    const {
        id,
        children,
        onButtonClick
    } = props;

    return (<button id={id} onClick={onButtonClick}>{children}</button>);
}