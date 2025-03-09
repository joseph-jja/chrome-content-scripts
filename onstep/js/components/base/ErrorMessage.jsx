import React from 'react';

export default function ErrorMessage(props) {

    const {
        children
    } = props;

    if (children) {
        return (<span class="errorField">{children}</span>);
    } else {
        return null;
    }
}
