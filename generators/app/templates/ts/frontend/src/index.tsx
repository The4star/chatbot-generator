// Comment out following polyfills if you don't need IE11 support
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import mainStore from './state/store';
import App from './App';


ReactDOM.render(
    <Provider store={mainStore}>
        <App />
    </Provider>
    , document.getElementById('chat-bot-ui'));
