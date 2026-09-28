import { StrictDict } from '@src/utils';
import { historyRecordLimit } from './constants';
import { filterQuery, stringifyUrl } from './utils';
import { getSiteConfig } from '@openedx/frontend-base';

export const getUrlPrefix = () => `${getSiteConfig().lmsBaseUrl}/api/`;
export const getBulkGradesUrl = (courseId) => `${getUrlPrefix()}bulk_grades/course/${courseId}/`;
export const getEnrollmentUrl = () => `${getUrlPrefix()}enrollment/v2/`;
export const getGradesUrl = () => `${getUrlPrefix()}grades/v1/`;
export const getGradebookUrl = (courseId) => `${getGradesUrl()}gradebook/${courseId}/`;
export const getBulkUpdateUrl = (courseId) => `${getGradebookUrl(courseId)}bulk-update`;
export const getInterventionUrl = (courseId) => `${getBulkGradesUrl(courseId)}intervention/`;
export const getCohortsUrl = (courseId) => `${getUrlPrefix()}cohorts/v1/courses/${courseId}/cohorts/`;
export const getTracksUrl = (courseId) => `${getEnrollmentUrl()}course/${courseId}?include_expired=1`;
export const getBulkHistoryUrl = (courseId) => `${getBulkUpdateUrl(courseId)}history/`;
export const getAssignmentTypesUrl = (courseId) => stringifyUrl(`${getGradebookUrl(courseId)}grading-info`, { graded_only: true });
export const getRolesUrl = (courseId) => stringifyUrl(`${getEnrollmentUrl()}roles/`, { courseId });
/**
 * bulkGradesUrlByRow(courseId, rowId)
 * returns the bulkGrades url with the given rowId.
 * @param {string} courseId - course identifier
 * @param {string} rowId - row/error identifier
 * @return {string} - bulk grades fetch url
 */
export const bulkGradesUrlByRow = (courseId, rowId) => stringifyUrl(getBulkGradesUrl(courseId), { error_id: rowId });

export const gradeCsvUrl = (courseId, options = {}) => stringifyUrl(getBulkGradesUrl(courseId), filterQuery(options));

export const interventionExportCsvUrl = (courseId, options = {}) => (
  stringifyUrl(getInterventionUrl(courseId), filterQuery(options))
);

export const sectionOverrideHistoryUrl = (subsectionId, userId) => stringifyUrl(
  `${getGradesUrl()}subsection/${subsectionId}/`,
  { user_id: userId, history_record_limit: historyRecordLimit },
);

export const instructorDashboardUrl = (courseId) => (
  `${getSiteConfig().lmsBaseUrl}/courses/${courseId}/instructor`
);

export default StrictDict({
  getUrlPrefix,
  getBulkGradesUrl,
  getEnrollmentUrl,
  getGradesUrl,
  getGradebookUrl,
  getBulkUpdateUrl,
  getInterventionUrl,
  getCohortsUrl,
  getTracksUrl,
  getBulkHistoryUrl,
  getAssignmentTypesUrl,
  getRolesUrl,
  bulkGradesUrlByRow,
  gradeCsvUrl,
  interventionExportCsvUrl,
  sectionOverrideHistoryUrl,
});
