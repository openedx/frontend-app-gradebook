import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithAllProviders } from '@src/testUtils';
import { useShowBulkManagement } from '@src/data/apiHook';
import { useGradeExportUrl } from '../data/hooks';
import { trackGradesReportDownloaded } from '@src/data/services/segment/events';
import { BulkManagementControls } from '.';

jest.mock('@src/data/apiHook', () => ({
  ...jest.requireActual('@src/data/apiHook'),
  useShowBulkManagement: jest.fn(),
}));
jest.mock('../data/hooks', () => ({
  ...jest.requireActual('../data/hooks'),
  useGradeExportUrl: jest.fn(),
}));
jest.mock('@src/data/services/segment/events', () => ({
  ...jest.requireActual('@src/data/services/segment/events'),
  trackGradesReportDownloaded: jest.fn(),
}));
jest.mock('@src/components/NetworkButton', () => ({ onClick }) => (
    <button type="button" onClick={onClick} data-testid="network-button">click</button>
  ));
jest.mock('../ImportGradesButton', () => () => <div data-testid="import-grades-button" />);

describe('BulkManagementControls', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useGradeExportUrl.mockReturnValue('https://example.com/grades.csv');
  });

  it('renders nothing when bulk management is off', () => {
    useShowBulkManagement.mockReturnValue(false);
    const { container } = renderWithAllProviders(<BulkManagementControls />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the download + import buttons when bulk management is on', () => {
    useShowBulkManagement.mockReturnValue(true);
    renderWithAllProviders(<BulkManagementControls />);
    expect(screen.getByTestId('network-button')).toBeInTheDocument();
    expect(screen.getByTestId('import-grades-button')).toBeInTheDocument();
  });

  it('tracks the download and navigates to the export URL on click', async () => {
    useShowBulkManagement.mockReturnValue(true);
    const assign = jest.fn();
    // eslint-disable-next-line no-restricted-globals
    Object.defineProperty(window, 'location', { value: { assign }, writable: true });

    renderWithAllProviders(<BulkManagementControls />);
    await userEvent.click(screen.getByTestId('network-button'));

    expect(trackGradesReportDownloaded).toHaveBeenCalled();
    expect(assign).toHaveBeenCalledWith('https://example.com/grades.csv');
  });
});
