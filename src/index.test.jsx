import React, { StrictMode } from 'react';

import {
  APP_READY,
  initialize,
  mergeConfig,
  subscribe,
} from '@edx/frontend-platform';

import messages from './i18n';
import App from './App';
import '.';

// These need to be var not let so they get hoisted
// and can be used by jest.mock (which is also hoisted)
var mockRender; // eslint-disable-line no-var
var mockCreateRoot; // eslint-disable-line no-var
jest.mock('react-dom/client', () => {
  mockRender = jest.fn();
  mockCreateRoot = jest.fn(() => ({
    render: mockRender,
  }));

  return ({
    createRoot: mockCreateRoot,
  });
});

jest.mock('@edx/frontend-platform', () => ({
  APP_READY: 'app-is-ready-key',
  initialize: jest.fn(),
  mergeConfig: jest.fn(),
  subscribe: jest.fn(),
}));
jest.mock('./App', () => 'App');

describe('app registry', () => {
  let getElement;

  beforeEach(() => {
    getElement = window.document.getElementById;
    window.document.getElementById = jest.fn(id => ({ id }));
  });
  afterAll(() => {
    window.document.getElementById = getElement;
  });
  test('subscribe is called for APP_READY, linking App to root element', () => {
    const callArgs = subscribe.mock.calls[0];
    expect(callArgs[0]).toEqual(APP_READY);
    callArgs[1]();
    expect(mockRender).toHaveBeenCalledWith(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  });
  test('initialize is called with requireAuthenticatedUser, messages, and a config handler', () => {
    expect(initialize).toHaveBeenCalledWith({
      messages,
      requireAuthenticatedUser: true,
      handlers: {
        config: expect.any(Function),
      },
    });
  });
  test('initialize config loads LMS_BASE_URL from env', () => {
    const oldEnv = process.env;
    const initializeArg = initialize.mock.calls[0][0];
    process.env = { ...oldEnv, LMS_BASE_URL: 'http://example.com/fake' };
    initializeArg.handlers.config();
    expect(mergeConfig).toHaveBeenCalledWith(
      expect.objectContaining({ LMS_BASE_URL: 'http://example.com/fake' }),
    );
    process.env = oldEnv;
  });
});
