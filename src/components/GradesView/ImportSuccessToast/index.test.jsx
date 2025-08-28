import React from 'react';

import { render, initializeMocks } from 'testUtilsExtra';

import ImportSuccessToast from '.';

jest.unmock('@openedx/paragon');
jest.unmock('react');
jest.unmock('@edx/frontend-platform/i18n');

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

const useImportSuccessToastData = require('./hooks');

initializeMocks();

describe('ImportSuccessToast', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without errors', () => {
    useImportSuccessToastData.mockReturnValue({
      action: {
        label: 'View Activity Log',
        onClick: jest.fn(),
      },
      onClose: jest.fn(),
      show: false,
      description: 'Import Successful! Grades will be updated momentarily.',
    });

    const { container } = render(<ImportSuccessToast />);
    expect(container).toBeInTheDocument();
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

    const { container } = render(<ImportSuccessToast />);
    expect(container).toBeInTheDocument();
    expect(useImportSuccessToastData).toHaveBeenCalled();
  });

  it('calls useImportSuccessToastData hook', () => {
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
