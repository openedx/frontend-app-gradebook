import React from 'react';
import { render, screen } from '@testing-library/react';

import { HistoryTable, mapHistoryRows } from './HistoryTable';

jest.mock('@openedx/paragon', () => ({
  ...jest.requireActual('@openedx/paragon'),
  DataTable: ({ data, itemCount }) => (
    <div data-testid="data-table" data-item-count={itemCount}>
      {data.map((row, i) => (
        <div key={i} data-testid="row">{row.filename}{row.user}</div>
      ))}
    </div>
  ),
}));
jest.mock('./ResultsSummary', () => () => <div data-testid="results-summary">ResultsSummary</div>);

const mockHistory = [
  {
    originalFilename: 'test-file-1.csv',
    user: 'test-user-1',
    timeUploaded: '2025-01-01T10:00:00Z',
    resultsSummary: { rowId: 1, text: 'Download results 1' },
  },
  {
    originalFilename: 'test-file-2.csv',
    user: 'test-user-2',
    timeUploaded: '2025-01-02T10:00:00Z',
    resultsSummary: { rowId: 2, text: 'Download results 2' },
  },
];

describe('HistoryTable', () => {
  describe('mapHistoryRows', () => {
    const raw = {
      resultsSummary: { rowId: 1, text: 'Download results' },
      originalFilename: 'test-file.csv',
      user: 'test-user',
      timeUploaded: '2025-01-01T10:00:00Z',
    };

    it('forwards non-mapped fields and returns filename/user as spans', () => {
      const result = mapHistoryRows(raw);
      expect(result.timeUploaded).toBe(raw.timeUploaded);
      render(<div>{result.filename}{result.user}</div>);
      expect(screen.getByText(raw.originalFilename)).toHaveClass('wrap-text-in-cell');
      expect(screen.getByText(raw.user)).toHaveClass('wrap-text-in-cell');
    });

    it('renders ResultsSummary for the resultsSummary field', () => {
      const result = mapHistoryRows(raw);
      render(<div>{result.resultsSummary}</div>);
      expect(screen.getByTestId('results-summary')).toBeInTheDocument();
    });
  });

  describe('component', () => {
    it('renders with empty history by default', () => {
      render(<HistoryTable />);
      const table = screen.getByTestId('data-table');
      expect(table).toBeInTheDocument();
      expect(table).toHaveAttribute('data-item-count', '0');
    });

    it('renders one row per history entry', () => {
      render(<HistoryTable bulkManagementHistory={mockHistory} />);
      const table = screen.getByTestId('data-table');
      expect(table).toHaveAttribute('data-item-count', String(mockHistory.length));
      expect(screen.getAllByTestId('row')).toHaveLength(mockHistory.length);
    });
  });
});
