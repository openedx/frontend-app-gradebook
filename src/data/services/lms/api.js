import { StrictDict } from '@src/utils';

import urls, {
  gradeCsvUrl,
  sectionOverrideHistoryUrl,
} from './urls';
import { pageSize, paramKeys } from './constants';
import messages from './messages';

import * as utils from './utils';

const { get, post, stringifyUrl } = utils;

/*********************************************************************************
 * GET Actions
 *********************************************************************************/
const assignmentTypes = (courseId) => get(urls.getAssignmentTypesUrl(courseId));
const cohorts = (courseId) => get(urls.getCohortsUrl(courseId));
const roles = (courseId) => get(urls.getRolesUrl(courseId));
const tracks = (courseId) => get(urls.getTracksUrl(courseId));

/**
 * fetch.gradebookData(courseId, searchText, cohort, track, options)
 * fetches updated gradebook data based on current filter selections.
 * Raises an error if assignment grade limits are set, but not assignment.
 * @param {string} courseId - course identifier
 * @param {string} searchText - search text filter
 * @param {nunber} cohort - selected cohort filter
 * @param {string} track - selected track filter
 * @param {object} options - additional optional filter values
 * @return {Promise} - get response
 */
const gradebookData = (courseId, searchText, cohort, track, options = {}) => {
  if ((options.assignmentGradeMax || options.assignmentGradeMin) && !options.assignment) {
    throw new Error(messages.errors.missingAssignment);
  }
  const queryParams = {
    [paramKeys.pageSize]: pageSize,
    [paramKeys.userContains]: searchText,
    [paramKeys.cohortId]: cohort,
    [paramKeys.enrollmentMode]: track,
    [paramKeys.courseGradeMax]: options.courseGradeMax,
    [paramKeys.courseGradeMin]: options.courseGradeMin,
    [paramKeys.excludedCourseRoles]: options.includeCourseRoleMembers ? null : ['all'],
    [paramKeys.assignment]: options.assignment,
    [paramKeys.assignmentGradeMax]: options.assignmentGradeMax,
    [paramKeys.assignmentGradeMin]: options.assignmentGradeMin,
  };
  return get(stringifyUrl(urls.getGradebookUrl(courseId), queryParams));
};

/**
 * fetch.gradeBulkOperationHistory(courseId)
 * fetches bulk operation history and raises an error if the operation fails
 * @param {string} courseId - course identifier
 * @return {Promise} - get response
 */
const gradeBulkOperationHistory = (courseId) => get(urls.getBulkHistoryUrl(courseId))
  .then(response => response.data)
  .catch(() => Promise.reject(Error(messages.errors.unhandledResponse)));

/**
 * fetch.gradeOverrideHistory(subsectionId, userId)
 * fetches grade override history for a given user on a given subsection
 * @param {string} subsectionId - subsection identifier
 * @param {string} userId - user identifier
 * @return {Promise} - get response
 */
const gradeOverrideHistory = (subsectionId, userId) => (
  get(sectionOverrideHistoryUrl(subsectionId, userId))
);

/*********************************************************************************
 * POST Actions
 *********************************************************************************/
/**
 * updateGradebookData(courseId, updateData)
 * sends an update message with new grades overrides
 * @param {string} courseId - course identifier
 * @param {object[]} updateData
 *  {
 *    user_id: <int>,
 *    usage_id: <string>
 *    grade: {
 *      earned_all_override: <int>
 *      possible_all_override: <int>
 *      earned_graded_override: <int>
 *      possible_graded_override: <int>
 *    }
 *  }
 * @return {Promise} - post response
 */
const updateGradebookData = (courseId, updateData) => post(urls.getBulkUpdateUrl(courseId), updateData);

/**
 * uploadGradeCsv(courseId, formData)
 * Posts form data to grade csv url.  On success, forwards response data.
 * Reject promise with result on failure.
 * @param {string} courseId - course identifier
 * @param {object} formData - new grade data
 * @return {Promise} - post response
 */
const uploadGradeCsv = (courseId, formData) => (
  post(gradeCsvUrl(courseId), formData).then((result) => {
    if (result.status === 200 && !result.data.error_messages.length) {
      return result.data;
    }
    return Promise.reject(result);
  })
);

export default StrictDict({
  fetch: StrictDict({
    assignmentTypes,
    cohorts,
    gradebookData,
    gradeBulkOperationHistory,
    gradeOverrideHistory,
    roles,
    tracks,
  }),
  updateGradebookData,
  uploadGradeCsv,
});
