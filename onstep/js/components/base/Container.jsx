import React from 'react';

export default function Container(props) {

    const {
        id,
        className,
        children
    } = props;

    return (<div id={id} class={className}>{children}</div>);
}
