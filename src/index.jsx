import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React from 'react';
import ReactDOM from 'react-dom';

import {
  APP_READY,
  initialize,
  subscribe,
} from '@edx/frontend-platform';
import { messages as headerMessages } from '@edx/frontend-component-header';
import { messages as footerMessages } from '@edx/frontend-component-footer';

import appMessages from './i18n';
import App from './App';

subscribe(APP_READY, () => {
  ReactDOM.render(<App />, document.getElementById('root'));
});

initialize({
  messages: [
    appMessages,
    headerMessages,
    footerMessages,
  ],
  requireAuthenticatedUser: true,
});
