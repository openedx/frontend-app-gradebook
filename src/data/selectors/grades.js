import { formatDateForDisplay } from '../actions/utils';
import { getFilters } from './filters';

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

const headingMapper = (category, label = 'All') => {
  const filters = {
    all: section => section.label,
    byCategory: section => section.label && section.category === category,
    byLabel: section => section.label && section.label === label,
  };

  let filter;
  if (label === 'All') {
    filter = category === 'All' ? 'all' : 'byCategory';
  } else {
    filter = 'byLabel';
  }

  return (entry) => {
    if (entry) {
      const results = ['Username', 'Email'];

      const assignmentHeadings = entry
        .filter(filters[filter])
        .map(s => s.label);

      const totals = ['Total'];

      return results.concat(assignmentHeadings).concat(totals);
    }
    return [];
  };
};

const getHeadings = (state) => {
  const filters = getFilters(state) || {};
  const {
    assignmentType: selectedAssignmentType,
    assignment: selectedAssignment,
  } = filters;
  const assignments = (state.grades.results[0] || {}).section_breakdown || [];
  const type = selectedAssignmentType || 'All';
  const assignment = (selectedAssignment || {}).label || 'All';
  return headingMapper(type, assignment)(assignments);
};

export { getBulkManagementHistory, getHeadings };
