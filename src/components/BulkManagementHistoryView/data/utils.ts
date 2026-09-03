import { formatDateForDisplay } from 'data/formatUtils';

/** Shape of the `data` payload inside one raw bulk-history entry. */
export interface BulkHistoryRowsData {
  processed_rows: number;
  saved_rows: number;
  total_rows: number;
}

/** One raw bulk-history entry as returned by the API. */
export interface RawBulkHistoryEntry {
  modified: string;
  original_filename: string;
  data: BulkHistoryRowsData;
  unique_id?: string;
  id: number;
  [key: string]: unknown;
}

/**
 * getRowsProcessed(data)
 * User-facing summary of total / processed / skipped / failed rows for one
 * bulk-history entry's `data` payload.
 */
export const getRowsProcessed = ({
  processed_rows: processed,
  saved_rows: saved,
  total_rows: total,
}: BulkHistoryRowsData): string => {
  const failed = processed - saved;
  const skipped = total - processed;
  const summaryEntries = [`${total} Students: ${saved} processed`];
  if (skipped > 0) { summaryEntries.push(`${skipped} skipped`); }
  if (failed > 0) { summaryEntries.push(`${failed} failed`); }
  return summaryEntries.join(', ');
};

/**
 * transformHistoryEntry(rawEntry)
 * Shape a raw bulk-history entry into what the history table renders (display
 * filename / results summary / uploaded date).
 */
export const transformHistoryEntry = ({
  modified,
  original_filename: originalFilename,
  data,
  // Discarded but destructured to strip from `rest`, matching the legacy shape.
  unique_id: _courseId,
  id,
  ...rest
}: RawBulkHistoryEntry) => ({
  timeUploaded: formatDateForDisplay(new Date(modified)),
  originalFilename,
  resultsSummary: {
    rowId: id,
    text: getRowsProcessed(data),
  },
  ...rest,
});
