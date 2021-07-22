/* eslint-disable import/no-self-import */
import { StrictDict } from 'utils';

import { Headings, GradeFormats } from 'data/constants/grades';
import { formatDateForDisplay } from 'data/actions/utils';
import simpleSelectorFactory from '../utils';
import * as module from './grades';

/**
 * getRowsProcessed(historyEntryData)
 * @param {object} historyEntryData - the data param from a bulk management history entry
 * @return {string} - user-facing summary of total/skipped/failed rows.
 */
export const getRowsProcessed = ({
  processed_rows: processed,
  saved_rows: saved,
  total_rows: total,
}) => {
  const failed = processed - saved;
  const skipped = total - processed;
  const summaryEntries = [`${total} Students: ${saved} processed`];
  if (skipped > 0) { summaryEntries.push(`${skipped} skipped`); }
  if (failed > 0) { summaryEntries.push(`${failed} failed`); }
  return summaryEntries.join(', ');
};

/**
 * formatGradeOverrideForDisplay(historyArray)
 * returns the grade override history results in display format.
 * @param {object[]} historyArray - array of gradeOverrideHistoryResults
 * @return {object[]} - display-formatted history results ({ date, grader, reason, adjustedGrade })
 */
export const formatGradeOverrideForDisplay = historyArray => historyArray.map(item => ({
  date: formatDateForDisplay(new Date(item.history_date)),
  grader: item.history_user,
  reason: item.override_reason,
  adjustedGrade: item.earned_graded_override,
}));

export const minGrade = '0';
export const maxGrade = '100';

/**
 * formatMaxCourseGrade(percentGrade)
 * Takes a percent grade and returns it unless it is equal to the max grade
 * @param {string} percentGrade - grade percentage
 * @return {string} percent grade or null
 */
export const formatMaxCourseGrade = (percentGrade) => (
  (percentGrade === maxGrade) ? null : percentGrade
);
/**
 * formatMinCourseGrade(percentGrade)
 * Takes a percent grade and returns it unless it is equal to the min grade
 * @param {string} percentGrade - grade percentage
 * @return {string} percent grade or null
 */
export const formatMinCourseGrade = (percentGrade) => (
  (percentGrade === minGrade) ? null : percentGrade
);

/**
 * formatMaxAssignmentGrade(percentGrade, options)
 * Takes a percent grade and returns it unless it is equal to the max grade or
 * the assignment id is set.
 * @param {string} percentGrade - grade percentage
 * @param {object} options - options object ({ assignmentId });
 * @return {string} percent grade or null
 */
export const formatMaxAssignmentGrade = (percentGrade, options) => (
  (percentGrade === maxGrade || !options.assignmentId) ? null : percentGrade
);

/**
 * formatMinAssignmentGrade(percentGrade, options)
 * Takes a percent grade and returns it unless it is equal to the min grade or
 * the assignment id is set.
 * @param {string} percentGrade - grade percentage
 * @param {object} options - options object ({ assignmentId });
 * @return {string} percent grade or null
 */
export const formatMinAssignmentGrade = (percentGrade, options) => (
  (percentGrade === minGrade || !options.assignmentId) ? null : percentGrade
);

/**
 * headingMapper(category, label='All')
 * Takes category and label filters and returns a method that will take a section breakdown
 * and return the appropriate table headings.
 * @param {string} category - assignment filter type
 * @param {string} label - assignment filter label
 * @return {string[]} - list of table headers
 */
export const headingMapper = (category, label = 'All') => {
  const filters = {
    all: section => section.label,
    byCategory: section => section.label && section.category === category,
    byLabel: section => section.label && section.label === label,
  };

  let filter;
  if (label === 'All') {
    filter = category === 'All' ? filters.all : filters.byCategory;
  } else {
    filter = filters.byLabel;
  }
  const { username, email, totalGrade } = Headings;
  const filteredLabels = (entry) => entry.filter(filter).map(s => s.label);

  return (entry) => (
    entry
      ? [username, email, ...filteredLabels(entry), totalGrade]
      : []
  );
};

/**
 * transformHistoryEntry(rawEntry)
 * Takes a raw bulkManagementHistory entry and formats it for consumption
 * @param {object} rawEntry - raw history entry to transform
 * @return {object} - transformed history entry
 *  ({ timeUploaded, originalFilename, resultsSummary, ... })
 */
export const transformHistoryEntry = ({
  modified,
  original_filename: originalFilename,
  data,
  unique_id: courseId,
  id,
  ...rest
}) => ({
  timeUploaded: formatDateForDisplay(new Date(modified)),
  originalFilename,
  resultsSummary: {
    rowId: id,
    text: module.getRowsProcessed(data),
  },
  ...rest,
});

/**
 * roundGrade(val)
 * Takes a number and rounds it to 2 decimal places
 * defaults to 0
 * @param {number=0} val - value to round.
 * @return {number} - rounded number
 */
export const roundGrade = val => parseFloat((val || 0).toFixed(2));
export const subsectionGrade = StrictDict({
  /**
   * subsectionGrade.absolute(subsection)
   * returns rounded {earned}/{possible} if attempted, else ${earned}
   * @param {object} subsection - grade subsection entry
   * @return {string} - absolute-formatted subsection grade string
   */
  [GradeFormats.absolute]: (subsection) => {
    const earned = module.roundGrade(subsection.score_earned);
    const possible = module.roundGrade(subsection.score_possible);
    return subsection.attempted ? `${earned}/${possible}` : `${earned}`;
  },
  /**
   * subsectionGrade.percent(subsection)
   * returns rounded percent times 100
   * @param {object} subsection - grade subsection entry
   * @return {string} - percent-formatted subsection grade string
   */
  [GradeFormats.percent]: (subsection) => (
    module.roundGrade(subsection.percent * 100)
  ),
});

// Selectors
/**
 * allGrades(state)
 * returns the top-level redux grades state.
 * @param {object} state - redux state
 * @return {object} - redux grades state
 */
export const allGrades = ({ grades: { results } }) => results;

/**
 * bulkImportError(state)
 * returns the stringified bulkManagement import error messages.
 * @param {object} state - redux state
 * @return {string} - bulk import error messages joined into a display form
 *   (or empty string if there are none)
 */
export const bulkImportError = ({ grades: { bulkManagement } }) => (
  (!!bulkManagement && bulkManagement.errorMessages)
    ? `Errors while processing: ${bulkManagement.errorMessages.join('; ')};`
    : ''
);

/**
 * bulkManagementHistory(state)
 * returns the bulkManagement history entries from the grades state
 * @param {object} state - redux state
 * @return {object[]} - list of bulkManagement history entries
 */
export const bulkManagementHistory = ({ grades: { bulkManagement } }) => (
  (bulkManagement.history || [])
);

/**
 * bulkManagementHistoryEntries(state)
 * returns transformed history entries from bulkManagement grades data.
 * @param {object} state - redux state
 * @return {object[]} - list of transformed bulkManagement history entries
 */
export const bulkManagementHistoryEntries = (state) => (
  module.bulkManagementHistory(state).map(module.transformHistoryEntry)
);

/**
 * getExampleSectionBreakdown(state)
 * returns section breakdown of first grades result.
 * @param {object} state - redux state
 * @return {object[]} - section breakdown of first grades result.
 */
export const getExampleSectionBreakdown = ({ grades }) => (
  (grades.results[0] || {}).section_breakdown || []
);

/**
 * gradeOverrides(state)
 * returns the gradeOverride history results
 * @param {object} state - redux state
 * @return {object[]} - grade override history result entries
 */
export const gradeOverrides = ({ grades }) => grades.gradeOverrideHistoryResults;

/**
 * hasOverrideErrors(state)
 * returns true iff gradeOverrideHistoryErrors are present
 * @param {object} state - redux state
 * @return {bool} - are there grade override history errors?
 */
export const hasOverrideErrors = ({ grades }) => !!grades.gradeOverrideHistoryError;

/**
 * uploadSuccess(state)
 * @param {object} state - redux state
 * @return {bool} - is bulkManagement.uploadSuccess true?
 */
export const uploadSuccess = ({ grades: { bulkManagement } }) => (
  !!bulkManagement && bulkManagement.uploadSuccess
);

const simpleSelectors = simpleSelectorFactory(
  ({ grades }) => grades,
  [
    'courseId',
    'filteredUsersCount',
    'totalUsersCount',
    'gradeFormat',
    'nextPage',
    'prevPage',
    'showSpinner',
    'gradeOverrideCurrentEarnedGradedOverride',
    'gradeOverrideHistoryError',
    'gradeOriginalEarnedGraded',
    'gradeOriginalPossibleGraded',
    'nextPage',
    'prevPage',
    'showSuccess',
  ],
);

export default StrictDict({
  bulkImportError,
  formatGradeOverrideForDisplay,
  formatMinAssignmentGrade,
  formatMaxAssignmentGrade,
  formatMaxCourseGrade,
  formatMinCourseGrade,
  hasOverrideErrors,
  headingMapper,

  roundGrade,
  subsectionGrade,

  ...simpleSelectors,
  allGrades,
  bulkManagementHistoryEntries,
  getExampleSectionBreakdown,
  gradeOverrides,
  uploadSuccess,
});
