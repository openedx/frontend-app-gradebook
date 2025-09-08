import React from 'react';

import { render, initializeMocks, screen } from 'testUtilsExtra';

import ImportSuccessToast from '.';
import useImportSuccessToastData from './hooks';

jest.mock('data/redux/hooks', () => ({
  actions: {
    app: {
      useSetView: jest.fn(),
      useSetShowImportSuccessToast: jest.fn(),
    },
  },
  selectors: {
    app: {
      useShowImportSuccessToast: jest.fn(),
    },
  },
}));

jest.mock('./hooks', () => jest.fn());

initializeMocks();

describe('ImportSuccessToast', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with show false', () => {
    useImportSuccessToastData.mockReturnValue({
      action: {
        label: 'View Activity Log',
        onClick: jest.fn(),
      },
      onClose: jest.fn(),
      show: false,
      description: 'Import Successful! Grades will be updated momentarily.',
    });

    render(<ImportSuccessToast />);
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    const toastMessage = screen.queryByText('Import Successful! Grades will be updated momentarily.');
    expect(toastMessage).toBeNull();
    expect(useImportSuccessToastData).toHaveBeenCalled();
  });

  it('renders with show true', () => {
    useImportSuccessToastData.mockReturnValue({
      action: {
        label: 'View Activity Log',
        onClick: jest.fn(),
      },
      onClose: jest.fn(),
      show: true,
      description: 'Import Successful! Grades will be updated momentarily.',
    });

    render(<ImportSuccessToast />);
    const toastMessage = screen.getByText('Import Successful! Grades will be updated momentarily.');
    expect(toastMessage).toBeInTheDocument();
    expect(useImportSuccessToastData).toHaveBeenCalled();
  });

  it('passes correct props to Toast component', () => {
    const mockOnClose = jest.fn();
    const mockOnClick = jest.fn();

    useImportSuccessToastData.mockReturnValue({
      action: {
        label: 'View Activity Log',
        onClick: mockOnClick,
      },
      onClose: mockOnClose,
      show: true,
      description: 'Import Successful! Grades will be updated momentarily.',
    });

    const { container } = render(<ImportSuccessToast />);
    expect(container).toBeInTheDocument();
    expect(useImportSuccessToastData).toHaveBeenCalled();
  });
});
