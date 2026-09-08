import React from 'react';

import { render, initializeMocks, screen } from 'testUtilsExtra';

import ImportResultToast from '.';
import useImportResultToastData from './hooks';

jest.mock('data/redux/hooks', () => ({
  actions: {
    app: {
      useSetView: jest.fn(),
      useSetShowImportSuccessToast: jest.fn(),
      useSetShowImportErrorToast: jest.fn(),
    },
  },
  selectors: {
    app: {
      useShowImportSuccessToast: jest.fn(),
      useShowImportErrorToast: jest.fn(),
    },
    grades: { useBulkImportErrorMessages: jest.fn() },
  },
}));

jest.mock('./hooks', () => jest.fn());

initializeMocks();

const SUCCESS = 'Import Successful! Grades will be updated momentarily.';
const FAILURE = 'Import failed. No grades were changed.';

const mockData = (overrides = {}) => useImportResultToastData.mockReturnValue({
  action: { label: 'View Activity Log', onClick: jest.fn() },
  onClose: jest.fn(),
  show: true,
  autohide: true,
  description: SUCCESS,
  ...overrides,
});

describe('ImportResultToast', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the toast container but no message with show false', () => {
    mockData({ show: false, description: '' });
    render(<ImportResultToast />);
    const toastRoot = document.getElementById('toast-root');
    expect(toastRoot).toBeInTheDocument();
    expect(toastRoot).toHaveClass('toast-container');
    expect(screen.queryByText(SUCCESS)).toBeNull();
    expect(useImportResultToastData).toHaveBeenCalled();
  });

  it('shows the success message', () => {
    mockData();
    render(<ImportResultToast />);
    expect(screen.getByText(SUCCESS)).toBeInTheDocument();
  });

  it('shows the failure message', () => {
    mockData({ description: FAILURE, autohide: false });
    render(<ImportResultToast />);
    expect(screen.getByText(FAILURE)).toBeInTheDocument();
  });

  it('renders the action button', () => {
    mockData();
    render(<ImportResultToast />);
    expect(screen.getByText('View Activity Log')).toBeInTheDocument();
  });
});
