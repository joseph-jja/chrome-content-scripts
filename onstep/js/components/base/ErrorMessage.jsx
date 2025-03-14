import React from 'react';

export default function ErrorMessage(props) {

    const {
        children
    } = props;

    if (children) {
        const messages = Array.isArray(children) ? children : [children];
        return (
            <>
                {messages.map((item) => (
                    <span class="errorField">{item}</span>
                ))}
            </>
        );    
    } else {
        return null;
    }
}
