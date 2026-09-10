import { getRowsProcessed, transformHistoryEntry } from './utils';

jest.mock('@src/data/formatUtils', () => ({
  ...jest.requireActual('@src/data/formatUtils'),
  formatDateForDisplay: (d: Date) => `formatted(${d.toISOString()})`,
}));

describe('BulkManagementHistoryView/data utils', () => {
  describe('getRowsProcessed', () => {
    it('renders only "processed" when there is no skipped or failed row', () => {
      expect(getRowsProcessed({
        processed_rows: 10, saved_rows: 10, total_rows: 10,
      })).toBe('10 Students: 10 processed');
    });

    it('appends "skipped" when the CSV had rows that were not processed', () => {
      expect(getRowsProcessed({
        processed_rows: 8, saved_rows: 8, total_rows: 10,
      })).toBe('10 Students: 8 processed, 2 skipped');
    });

    it('appends "failed" when a processed row could not be saved', () => {
      expect(getRowsProcessed({
        processed_rows: 10, saved_rows: 7, total_rows: 10,
      })).toBe('10 Students: 7 processed, 3 failed');
    });

    it('appends both when both skipped and failed rows are present', () => {
      expect(getRowsProcessed({
        processed_rows: 7, saved_rows: 5, total_rows: 10,
      })).toBe('10 Students: 5 processed, 3 skipped, 2 failed');
    });
  });

  describe('transformHistoryEntry', () => {
    it('shapes the raw entry into what the history table renders', () => {
      const raw = {
        modified: '2024-05-06T07:08:09Z',
        original_filename: 'overrides.csv',
        data: { processed_rows: 10, saved_rows: 10, total_rows: 10 },
        id: 42,
        unique_id: 'uid-42',
      };
      expect(transformHistoryEntry(raw)).toEqual({
        timeUploaded: 'formatted(2024-05-06T07:08:09.000Z)',
        originalFilename: 'overrides.csv',
        resultsSummary: {
          rowId: 42,
          text: '10 Students: 10 processed',
        },
        unique_id: 'uid-42',
      });
    });
  });
});
