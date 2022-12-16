import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React from 'react';
import ReactDOM from 'react-dom';

import {
  APP_READY,
  initialize,
  mergeConfig,
  subscribe,
} from '@edx/frontend-platform';
import { messages as headerMessages } from '@edx/frontend-component-header';
import { messages as footerMessages } from '@edx/frontend-component-footer';
import { messages as paragonMessages } from '@edx/paragon';
import appMessages from './i18n';
import App from './App';

subscribe(APP_READY, () => {
  ReactDOM.render(<App />, document.getElementById('root'));
});

initialize({
  handlers: {
    config: () => {
      mergeConfig({
        BASE_URL: process.env.BASE_URL,
        LMS_BASE_URL: process.env.LMS_BASE_URL,
        LOGIN_URL: process.env.LOGIN_URL,
        LOGOUT_URL: process.env.LOGOUT_URL,
        CSRF_TOKEN_API_PATH: process.env.CSRF_TOKEN_API_PATH,
        REFRESH_ACCESS_TOKEN_ENDPOINT: process.env.REFRESH_ACCESS_TOKEN_ENDPOINT,
        DATA_API_BASE_URL: process.env.DATA_API_BASE_URL,
        SECURE_COOKIES: process.env.NODE_ENV !== 'development',
        SEGMENT_KEY: process.env.SEGMENT_KEY,
        ACCESS_TOKEN_COOKIE_NAME: process.env.ACCESS_TOKEN_COOKIE_NAME,
      });
    },
  },
  messages: [
    appMessages,
    headerMessages,
    footerMessages,
    paragonMessages,
  ],
  requireAuthenticatedUser: true,
});
