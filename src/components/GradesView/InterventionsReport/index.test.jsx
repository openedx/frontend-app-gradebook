import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithAllProviders } from '@src/testUtils';
import { useShowBulkManagement } from '@src/data/apiHook';
import { useInterventionExportUrl } from '../data/hooks';
import { trackInterventionReportDownloaded } from '@src/data/services/segment/events';
import InterventionsReport from '.';

jest.mock('@src/data/apiHook', () => ({
  ...jest.requireActual('@src/data/apiHook'),
  useShowBulkManagement: jest.fn(),
}));
jest.mock('../data/hooks', () => ({
  ...jest.requireActual('../data/hooks'),
  useInterventionExportUrl: jest.fn(),
}));
jest.mock('@src/data/services/segment/events', () => ({
  ...jest.requireActual('@src/data/services/segment/events'),
  trackInterventionReportDownloaded: jest.fn(),
}));
jest.mock('@src/components/NetworkButton', () => (props) => (
  // eslint-disable-next-line react/prop-types
  <button type="button" onClick={props.onClick} data-testid="network-button">click</button>
));

describe('InterventionsReport', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useInterventionExportUrl.mockReturnValue('https://example.com/report.csv');
  });

  it('renders nothing when bulk management is off', () => {
    useShowBulkManagement.mockReturnValue(false);
    const { container } = renderWithAllProviders(<InterventionsReport />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders heading and network button when bulk management is on', () => {
    useShowBulkManagement.mockReturnValue(true);
    renderWithAllProviders(<InterventionsReport />);
    expect(screen.getByRole('heading', { level: 4 })).toBeInTheDocument();
    expect(screen.getByTestId('network-button')).toBeInTheDocument();
  });

  it('emits segment event and navigates on button click', async () => {
    useShowBulkManagement.mockReturnValue(true);
    const assign = jest.fn();
    // eslint-disable-next-line no-restricted-globals
    Object.defineProperty(window, 'location', { value: { assign }, writable: true });

    renderWithAllProviders(<InterventionsReport />);
    await userEvent.click(screen.getByTestId('network-button'));

    expect(trackInterventionReportDownloaded).toHaveBeenCalled();
    expect(assign).toHaveBeenCalledWith('https://example.com/report.csv');
  });
});
