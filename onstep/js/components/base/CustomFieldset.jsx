import React from 'react';

export default function CustomFieldset(props) {

    const {
        legendtext,
        children
    } = props;

    return (
        <fieldset>
            <legend>{legendtext}</legend>
            {children}
       </fieldset>
    );
};
