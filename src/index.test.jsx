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
import '.';

jest.mock('react-dom', () => ({
  render: jest.fn(),
}));
jest.mock('@edx/frontend-platform', () => ({
  APP_READY: 'app-is-ready-key',
  initialize: jest.fn(),
  subscribe: jest.fn(),
}));
jest.mock('@edx/frontend-component-header', () => ({
  messages: ['some', 'messages'],
}));
jest.mock('@edx/frontend-component-footer', () => ({
  messages: ['some', 'messages'],
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
    expect(callArgs[1]()).toEqual(
      ReactDOM.render(<App />, document.getElementById('root')),
    );
  });
  test('initialize is called with footerMessages and requireAuthenticatedUser', () => {
    expect(initialize).toHaveBeenCalledWith({
      messages: [appMessages, headerMessages, footerMessages],
      requireAuthenticatedUser: true,
    });
  });
});
