// Comment out following polyfills if you don't need IE11 support
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { BotStateProvider } from './state/bot/BotStateProvider'

ReactDOM.render(
    <BotStateProvider>
        <App />
    </BotStateProvider>
    , document.getElementById('versa-chat-bot-ui'));
