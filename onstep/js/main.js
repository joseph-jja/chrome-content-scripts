import React from 'react';
import {
    createRoot
} from 'react-dom/client';

import MainApp from 'js/MainApp.jsx';

const container = document.getElementById('app-container');
const root = createRoot(container);
root.render( <MainApp/> );

