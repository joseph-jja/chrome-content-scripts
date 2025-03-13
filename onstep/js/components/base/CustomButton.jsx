import React from 'react';

export default function CustomButton(props) {

    const {
        id,
        children,
        enabled,
        onButtonClick
    } = props;

    return (<button id={id} 
        class={enabled ? 'active_button' : ''}
        onClick={onButtonClick}>{children}</button>);
}