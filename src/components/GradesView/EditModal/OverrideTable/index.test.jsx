import React from 'react';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import useOverrideTableData from './hooks';
import OverrideTable from '.';

jest.unmock('@openedx/paragon');
jest.unmock('react');
jest.unmock('@edx/frontend-platform/i18n');

jest.mock('utils', () => ({
  ...jest.requireActual('utils'),
  formatDateForDisplay: (date) => ({ formatted: date }),
}));
jest.mock('./hooks', () => jest.fn());

const hookProps = {
  hide: false,
  data: [
    { filename: 'data' },
    { resultsSummary: 'test-data' },
  ],
  columns: [{
    Header: 'Gradebook',
    accessor: 'filename',
  },
  {
    Header: 'Download Summary',
    accessor: 'resultsSummary',
  }],
};

describe('OverrideTable component', () => {
  beforeEach(() => {
    jest
      .clearAllMocks()
      .useFakeTimers('modern')
      .setSystemTime(new Date('2000-01-01').getTime());
  });
  describe('hooks', () => {
    it('initializes hook data', () => {
      useOverrideTableData.mockReturnValue(hookProps);
      render(<IntlProvider locale="en"><OverrideTable /></IntlProvider>);
      expect(useOverrideTableData).toHaveBeenCalled();
    });
  });
  describe('behavior', () => {
    it('null render if hide', () => {
      useOverrideTableData.mockReturnValue({ ...hookProps, hide: true });
      render(<IntlProvider locale="en"><OverrideTable /></IntlProvider>);
      expect(screen.queryByRole('table')).toBeNull();
    });
    it('renders table with correct data', () => {
      useOverrideTableData.mockReturnValue(hookProps);
      render(<IntlProvider locale="en"><OverrideTable /></IntlProvider>);
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
      expect(screen.getByText(hookProps.columns[0].Header)).toBeInTheDocument();
      expect(screen.getByText(hookProps.columns[1].Header)).toBeInTheDocument();
      expect(screen.getByText(hookProps.data[0].filename)).toBeInTheDocument();
      expect(screen.getByText(hookProps.data[1].resultsSummary)).toBeInTheDocument();
    });
  });
});
