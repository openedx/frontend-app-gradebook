import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import {
  APP_READY,
  initialize,
  mergeConfig,
  subscribe,
} from '@edx/frontend-platform';

import lightning from './lightning';

import messages from './i18n';
import App from './App';

subscribe(APP_READY, () => {
  lightning();

  const root = createRoot(document.getElementById('root'));

  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
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
        DISPLAY_FEEDBACK_WIDGET: process.env.DISPLAY_FEEDBACK_WIDGET,
      });
    },
  },
  messages,
  requireAuthenticatedUser: true,
});
