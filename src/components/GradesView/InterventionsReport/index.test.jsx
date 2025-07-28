import React from 'react';

import { render, screen, initializeMocks } from 'testUtilsExtra';

import InterventionsReport from '.';

jest.unmock('@openedx/paragon');
jest.unmock('react');
jest.unmock('@edx/frontend-platform/i18n');

jest.mock('components/NetworkButton', () => 'NetworkButton');
jest.mock('./hooks', () => jest.fn());

const useInterventionsReportData = require('./hooks');

initializeMocks();

describe('InterventionsReport', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without errors when show is true', () => {
    useInterventionsReportData.mockReturnValue({
      show: true,
      handleClick: jest.fn(),
    });

    render(<InterventionsReport />);
    expect(screen.getByRole('heading', { level: 4 })).toBeInTheDocument();
    expect(useInterventionsReportData).toHaveBeenCalled();
  });

  it('renders nothing when show is false', () => {
    useInterventionsReportData.mockReturnValue({
      show: false,
      handleClick: jest.fn(),
    });

    render(<InterventionsReport />);
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(screen.queryByText('Interventions Report')).not.toBeInTheDocument();
    expect(useInterventionsReportData).toHaveBeenCalled();
  });

  it('calls useInterventionsReportData hook', () => {
    useInterventionsReportData.mockReturnValue({
      show: true,
      handleClick: jest.fn(),
    });

    render(<InterventionsReport />);
    expect(useInterventionsReportData).toHaveBeenCalled();
  });

  it('renders with correct content when show is true', () => {
    const mockReportData = {
      show: true,
      handleClick: jest.fn(),
    };

    useInterventionsReportData.mockReturnValue(mockReportData);

    render(<InterventionsReport />);

    expect(screen.getByText('Interventions Report')).toBeInTheDocument();

    expect(
      screen.getByText(/Need to find students who may be falling behind/),
    ).toBeInTheDocument();

    const networkButton = document.querySelector('networkbutton');
    expect(networkButton).toBeInTheDocument();

    expect(useInterventionsReportData).toHaveBeenCalled();
  });
});
