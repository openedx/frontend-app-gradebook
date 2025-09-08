import React from 'react';
import { render, screen, initializeMocks } from 'testUtilsExtra';
import { DataTable } from '@openedx/paragon';

import selectors from 'data/selectors';
import { bulkManagementColumns } from 'data/constants/app';

import { HistoryTable, mapHistoryRows, mapStateToProps } from './HistoryTable';
import ResultsSummary from './ResultsSummary';

initializeMocks();

jest.mock('@openedx/paragon', () => ({
  ...jest.requireActual('@openedx/paragon'),
  DataTable: jest.fn(() => <div data-testid="data-table">DataTable</div>),
}));
jest.mock('./ResultsSummary', () => jest.fn(() => <div data-testid="results-summary">ResultsSummary</div>));
jest.mock('data/selectors', () => ({
  __esModule: true,
  default: {
    grades: {
      bulkManagementHistoryEntries: jest.fn(),
    },
  },
}));

describe('HistoryTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockBulkManagementHistory = [
    {
      originalFilename: 'test-file-1.csv',
      user: 'test-user-1',
      timeUploaded: '2025-01-01T10:00:00Z',
      resultsSummary: {
        rowId: 1,
        text: 'Download results 1',
      },
    },
    {
      originalFilename: 'test-file-2.csv',
      user: 'test-user-2',
      timeUploaded: '2025-01-02T10:00:00Z',
      resultsSummary: {
        rowId: 2,
        text: 'Download results 2',
      },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('mapHistoryRows', () => {
    const mockRow = {
      resultsSummary: {
        rowId: 1,
        text: 'Download results',
      },
      originalFilename: 'test-file.csv',
      user: 'test-user',
      timeUploaded: '2025-01-01T10:00:00Z',
    };

    it('transforms row data correctly', () => {
      const result = mapHistoryRows(mockRow);

      expect(result).toHaveProperty('resultsSummary');
      expect(result).toHaveProperty('filename');
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('timeUploaded');
      expect(result.timeUploaded).toBe('2025-01-01T10:00:00Z');
    });

    it('wraps filename in span with correct class', () => {
      const result = mapHistoryRows(mockRow);
      render(<div>{result.filename}</div>);

      const filenameSpan = screen.getByText('test-file.csv');
      expect(filenameSpan).toBeInTheDocument();
      expect(filenameSpan).toHaveClass('wrap-text-in-cell');
    });

    it('wraps user in span with correct class', () => {
      const result = mapHistoryRows(mockRow);
      render(<div>{result.user}</div>);

      const userSpan = screen.getByText('test-user');
      expect(userSpan).toBeInTheDocument();
      expect(userSpan).toHaveClass('wrap-text-in-cell');
    });

    it('renders ResultsSummary component with correct props', () => {
      const result = mapHistoryRows(mockRow);
      render(<div>{result.resultsSummary}</div>);

      expect(ResultsSummary).toHaveBeenCalledWith(mockRow.resultsSummary, {});
      expect(screen.getByTestId('results-summary')).toBeInTheDocument();
    });
  });

  describe('component', () => {
    it('renders DataTable with empty data when no history provided', () => {
      render(<HistoryTable />);

      expect(DataTable).toHaveBeenCalledWith(
        {
          data: [],
          hasFixedColumnWidths: true,
          columns: bulkManagementColumns,
          className: 'table-striped',
          itemCount: 0,
        },
        {},
      );
      expect(screen.getByTestId('data-table')).toBeInTheDocument();
    });

    it('renders DataTable with mapped history data', () => {
      render(
        <HistoryTable bulkManagementHistory={mockBulkManagementHistory} />,
      );

      expect(DataTable).toHaveBeenCalledWith(
        {
          data: expect.arrayContaining([
            expect.objectContaining({
              filename: expect.any(Object),
              user: expect.any(Object),
              resultsSummary: expect.any(Object),
              timeUploaded: '2025-01-01T10:00:00Z',
            }),
            expect.objectContaining({
              filename: expect.any(Object),
              user: expect.any(Object),
              resultsSummary: expect.any(Object),
              timeUploaded: '2025-01-02T10:00:00Z',
            }),
          ]),
          hasFixedColumnWidths: true,
          columns: bulkManagementColumns,
          className: 'table-striped',
          itemCount: 2,
        },
        {},
      );
    });

    it('passes correct props to DataTable', () => {
      render(
        <HistoryTable bulkManagementHistory={mockBulkManagementHistory} />,
      );

      const dataTableCall = DataTable.mock.calls[0][0];
      expect(dataTableCall.hasFixedColumnWidths).toBe(true);
      expect(dataTableCall.columns).toBe(bulkManagementColumns);
      expect(dataTableCall.className).toBe('table-striped');
      expect(dataTableCall.itemCount).toBe(mockBulkManagementHistory.length);
    });
  });

  describe('mapStateToProps', () => {
    const mockState = { test: 'state' };
    const mockHistoryEntries = [
      { originalFilename: 'file1.csv', user: 'user1' },
      { originalFilename: 'file2.csv', user: 'user2' },
    ];

    beforeEach(() => {
      selectors.grades.bulkManagementHistoryEntries.mockReturnValue(
        mockHistoryEntries,
      );
    });

    it('maps bulkManagementHistory from selector', () => {
      const result = mapStateToProps(mockState);

      expect(
        selectors.grades.bulkManagementHistoryEntries,
      ).toHaveBeenCalledWith(mockState);
      expect(result.bulkManagementHistory).toBe(mockHistoryEntries);
    });
  });
});
