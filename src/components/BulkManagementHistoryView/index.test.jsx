import { renderWithAllProviders, initializeMocks } from '@src/testUtils';
import { screen } from '@testing-library/react';

import { BulkManagementHistoryView } from '.';
import messages from './messages';

jest.mock('./BulkManagementAlerts', () => jest.fn(() => <div>BulkManagementAlerts</div>));
jest.mock('./HistoryTable', () => jest.fn(() => <div>HistoryTable</div>));

initializeMocks();

describe('BulkManagementHistoryView', () => {
  describe('component', () => {
    beforeEach(() => {
      renderWithAllProviders(<BulkManagementHistoryView />);
    });
    describe('render alerts and heading', () => {
      it('heading - h4 loaded from messages', () => {
        expect(screen.getByText(messages.heading.defaultMessage)).toBeInTheDocument();
        expect(screen.getByText(messages.helpText.defaultMessage)).toBeInTheDocument();
        expect(screen.getByText('BulkManagementAlerts')).toBeInTheDocument();
        expect(screen.getByText('HistoryTable')).toBeInTheDocument();
      });
    });
  });
});
