import { renderWithAllProviders, initializeMocks } from '@src/testUtils';
import { screen } from '@testing-library/react';

import ImportResultToast from '.';
import useImportResultToastData from './hooks';

jest.mock('./hooks', () => jest.fn());

initializeMocks();

const SUCCESS = 'Import Successful! Grades will be updated momentarily.';
const FAILURE = 'Import failed. No grades were changed.';

const mockData = (overrides = {}) => useImportResultToastData.mockReturnValue({
  action: { label: 'View Activity Log', onClick: jest.fn() },
  onClose: jest.fn(),
  show: true,
  toastProps: {},
  description: SUCCESS,
  ...overrides,
});

describe('ImportResultToast', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the toast container but no message with show false', () => {
    mockData({ show: false, description: '' });
    renderWithAllProviders(<ImportResultToast />);

    const toastRoot = document.getElementById('toast-root');
    expect(toastRoot).toBeInTheDocument();
    expect(toastRoot).toHaveClass('toast-container');
    expect(screen.queryByText(SUCCESS)).toBeNull();
    expect(useImportResultToastData).toHaveBeenCalled();
  });

  it('shows the success message', () => {
    mockData();
    renderWithAllProviders(<ImportResultToast />);
    expect(screen.getByText(SUCCESS)).toBeInTheDocument();
  });

  it('shows the failure message', () => {
    mockData({ description: FAILURE, toastProps: { autohide: false } });
    renderWithAllProviders(<ImportResultToast />);
    expect(screen.getByText(FAILURE)).toBeInTheDocument();
  });

  it('renders the action button', () => {
    mockData();
    renderWithAllProviders(<ImportResultToast />);
    expect(screen.getByText('View Activity Log')).toBeInTheDocument();
  });

  it('retires the toast when the view unmounts', () => {
    const onClose = jest.fn();
    mockData({ description: FAILURE, toastProps: { autohide: false }, onClose });
    const { unmount } = renderWithAllProviders(<ImportResultToast />);

    expect(onClose).not.toHaveBeenCalled();
    unmount();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not retire it again on a re-render', () => {
    const onClose = jest.fn();
    mockData({ description: FAILURE, toastProps: { autohide: false }, onClose });
    const { rerender } = renderWithAllProviders(<ImportResultToast />);

    rerender(<ImportResultToast />);
    expect(onClose).not.toHaveBeenCalled();
  });
});
