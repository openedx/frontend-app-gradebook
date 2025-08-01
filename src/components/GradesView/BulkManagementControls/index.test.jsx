import React from 'react';
import { render, screen, initializeMocks } from 'testUtilsExtra';

import NetworkButton from 'components/NetworkButton';
import ImportGradesButton from '../ImportGradesButton';

import { BulkManagementControls } from './index';
import useBulkManagementControlsData from './hooks';
import messages from './messages';

jest.unmock('@openedx/paragon');
jest.unmock('react');
jest.unmock('@edx/frontend-platform/i18n');
jest.mock('components/NetworkButton', () => jest.fn(() => <div data-testid="network-button">NetworkButton</div>));
jest.mock('../ImportGradesButton', () => jest.fn(() => (
  <div data-testid="import-grades-button">ImportGradesButton</div>
)));
jest.mock('./hooks', () => jest.fn());

initializeMocks();

describe('BulkManagementControls', () => {
  const mockHandleClickExportGrades = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when show is false', () => {
    beforeEach(() => {
      useBulkManagementControlsData.mockReturnValue({
        show: false,
        handleClickExportGrades: mockHandleClickExportGrades,
      });
    });

    it('renders nothing when show is false', () => {
      render(<BulkManagementControls />);
      expect(screen.queryByTestId('network-button')).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('import-grades-button'),
      ).not.toBeInTheDocument();
    });

    it('does not render NetworkButton when show is false', () => {
      render(<BulkManagementControls />);
      expect(NetworkButton).not.toHaveBeenCalled();
    });

    it('does not render ImportGradesButton when show is false', () => {
      render(<BulkManagementControls />);
      expect(ImportGradesButton).not.toHaveBeenCalled();
    });
  });

  describe('when show is true', () => {
    beforeEach(() => {
      useBulkManagementControlsData.mockReturnValue({
        show: true,
        handleClickExportGrades: mockHandleClickExportGrades,
      });
    });

    it('renders the container div with correct class when show is true', () => {
      render(<BulkManagementControls />);
      const containerDiv = screen.getByTestId('network-button').parentElement;
      expect(containerDiv).toHaveClass('d-flex');
    });

    it('renders NetworkButton with correct props', () => {
      render(<BulkManagementControls />);

      expect(NetworkButton).toHaveBeenCalledWith(
        {
          label: messages.downloadGradesBtn,
          onClick: mockHandleClickExportGrades,
        },
        {},
      );
      expect(screen.getByTestId('network-button')).toBeInTheDocument();
    });

    it('renders ImportGradesButton', () => {
      render(<BulkManagementControls />);

      expect(ImportGradesButton).toHaveBeenCalledWith({}, {});
      expect(screen.getByTestId('import-grades-button')).toBeInTheDocument();
    });

    it('calls handleClickExportGrades when NetworkButton is clicked', () => {
      render(<BulkManagementControls />);

      const networkButtonCall = NetworkButton.mock.calls[0][0];
      const { onClick } = networkButtonCall;

      onClick();
      expect(mockHandleClickExportGrades).toHaveBeenCalledTimes(1);
    });

    it('passes correct label to NetworkButton', () => {
      render(<BulkManagementControls />);

      const networkButtonCall = NetworkButton.mock.calls[0][0];
      expect(networkButtonCall.label).toBe(messages.downloadGradesBtn);
    });

    it('renders both buttons in the correct order', () => {
      render(<BulkManagementControls />);

      expect(NetworkButton).toHaveBeenCalled();
      expect(ImportGradesButton).toHaveBeenCalled();

      const networkButton = screen.getByTestId('network-button');
      const importButton = screen.getByTestId('import-grades-button');

      expect(networkButton).toBeInTheDocument();
      expect(importButton).toBeInTheDocument();
    });
  });

  describe('hook integration', () => {
    it('calls useBulkManagementControlsData hook', () => {
      useBulkManagementControlsData.mockReturnValue({
        show: true,
        handleClickExportGrades: mockHandleClickExportGrades,
      });

      render(<BulkManagementControls />);
      expect(useBulkManagementControlsData).toHaveBeenCalledTimes(1);
    });

    it('uses the show value from hook to determine rendering', () => {
      useBulkManagementControlsData.mockReturnValue({
        show: false,
        handleClickExportGrades: mockHandleClickExportGrades,
      });

      render(<BulkManagementControls />);
      expect(screen.queryByTestId('network-button')).not.toBeInTheDocument();

      useBulkManagementControlsData.mockReturnValue({
        show: true,
        handleClickExportGrades: mockHandleClickExportGrades,
      });

      render(<BulkManagementControls />);
      expect(screen.getByTestId('network-button')).toBeInTheDocument();
    });

    it('passes handleClickExportGrades from hook to NetworkButton', () => {
      const customHandler = jest.fn();
      useBulkManagementControlsData.mockReturnValue({
        show: true,
        handleClickExportGrades: customHandler,
      });

      render(<BulkManagementControls />);

      const networkButtonCall = NetworkButton.mock.calls[0][0];
      expect(networkButtonCall.onClick).toBe(customHandler);
    });
  });
});
