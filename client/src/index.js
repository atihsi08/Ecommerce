import React from 'react';
import ReactDom from 'react-dom';
import App from './App.js';
import { Provider } from 'react-redux';
import { store } from './store.js';
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'

const options = {
    position: positions.BOTTOM_CENTER,
    timeout: 5000,
    transition: transitions.SCALE
}

ReactDom.render(
    <Provider store={store}>
        <AlertProvider template={AlertTemplate} {...options}>
            <App />
        </AlertProvider>
    </Provider>
    , document.getElementById('root'));
