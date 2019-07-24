import { formatDateForDisplay } from '../../data/actions/utils';

const getRowsProcessed = (data) => {
  const {
    processed_rows: processed,
    saved_rows: saved,
    total_rows: total,
  } = data;
  return {
    total,
    successfullyProcessed: saved,
    failed: processed - saved,
    skipped: total - processed,
  };
};

const transformHistoryEntry = (historyRow) => {
  const {
    modified,
    original_filename: originalFilename,
    data,
    ...rest
  } = historyRow;

  const timeUploaded = formatDateForDisplay(new Date(modified));
  const summaryOfRowsProcessed = getRowsProcessed(data);

  return {
    timeUploaded,
    originalFilename,
    summaryOfRowsProcessed,
    ...rest,
  };
};
const getBulkManagementHistoryFromState = state =>
  state.grades.bulkManagement.history || [];
const getBulkManagementHistory = state =>
  getBulkManagementHistoryFromState(state).map(transformHistoryEntry);

export default getBulkManagementHistory;
