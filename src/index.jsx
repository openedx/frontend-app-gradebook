import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React from 'react';
import ReactDOM from 'react-dom';
import {
  APP_READY,
  initialize,
  subscribe,
} from '@edx/frontend-platform';

import { messages as footerMessages } from '@edx/frontend-component-footer';

import App from './App';

subscribe(APP_READY, () => {
  ReactDOM.render(<App />, document.getElementById('root'));
});

initialize({
  messages: [
    footerMessages,
  ],
  requireAuthenticatedUser: true,
});
