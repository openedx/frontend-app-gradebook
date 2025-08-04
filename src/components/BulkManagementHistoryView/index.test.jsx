/* eslint-disable import/no-named-as-default */
import React from 'react';
import { render, initializeMocks, screen } from 'testUtilsExtra';
import { formatMessage } from 'testUtils';

import { BulkManagementHistoryView } from '.';
import messages from './messages';

jest.unmock('@openedx/paragon');
jest.unmock('react');
jest.unmock('@edx/frontend-platform/i18n');

initializeMocks();

describe('BulkManagementHistoryView', () => {
  describe('component', () => {
    beforeEach(() => {
      render(<BulkManagementHistoryView />);
    });
    describe('snapshot', () => {
      test('heading - h4 loaded from messages', () => {
        expect(screen.getByText(formatMessage(messages.heading))).toBeInTheDocument();
      });
    });
  });
});
