import { formatDateForDisplay } from '../actions/utils';
import simpleSelectorFactory from '../utils';

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

const transformHistoryEntry = ({
  modified,
  original_filename: originalFilename,
  data,
  ...rest
}) => ({
  timeUploaded: formatDateForDisplay(new Date(modified)),
  originalFilename,
  summaryOfRowsProcessed: getRowsProcessed(data),
  ...rest,
});

const bulkManagementHistory = ({ grades: { bulkManagement } }) => (
  (bulkManagement.history || [])
);

const bulkManagementHistoryEntries = (state) => (
  bulkManagementHistory(state).map(transformHistoryEntry)
);

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

const getExampleSectionBreakdown = ({ grades }) => (
  (grades.results[0] || {}).section_breakdown || []
);

const composeFilters = (...predicates) => (percentGrade, options = {}) => predicates.reduce((accum, predicate) => {
  if (predicate(percentGrade, options)) {
    return null;
  }
  return accum;
}, percentGrade);

const percentGradeIsMax = percentGrade => (
  percentGrade === '100'
);

const percentGradeIsMin = percentGrade => (
  percentGrade === '0'
);

const assignmentIdIsDefined = (percentGrade, { assignmentId }) => (
  !assignmentId
);

const formatMaxCourseGrade = composeFilters(percentGradeIsMax);
const formatMinCourseGrade = composeFilters(percentGradeIsMin);

const formatMaxAssignmentGrade = composeFilters(
  percentGradeIsMax,
  assignmentIdIsDefined,
);

const formatMinAssignmentGrade = composeFilters(
  percentGradeIsMin,
  assignmentIdIsDefined,
);

const simpleSelectors = simpleSelectorFactory(
  ({ grades }) => grades,
  [
    'filteredUsersCount',
    'totalUsersCount',
    'gradeFormat',
    'showSpinner',
    'gradeOverrideCurrentEarnedGradedOverride',
    'gradeOverrideHistoryError',
    'gradeOriginalEarnedGraded',
    'gradeOriginalPossibleGraded',
    'showSuccess',
  ],
);

const allGrades = ({ grades: { results } }) => results;
const uploadSuccess = ({ grades: { bulkManagement } }) => (!!bulkManagement && bulkManagement.uploadSuccess);

const bulkImportError = ({ grades: { bulkManagement } }) => (
  (!!bulkManagement && bulkManagement.errorMessages)
    ? `Errors while processing: ${bulkManagement.errorMessages.join(', ')}`
    : ''
);
const gradeOverrides = ({ grades }) => grades.gradeOverrideHistoryResults;

const selectors = {
  bulkImportError,
  formatMinAssignmentGrade,
  formatMaxAssignmentGrade,
  formatMaxCourseGrade,
  formatMinCourseGrade,
  getExampleSectionBreakdown,
  headingMapper,

  ...simpleSelectors,
  allGrades,
  uploadSuccess,
  bulkManagementHistoryEntries,
  gradeOverrides,
};

export default selectors;
