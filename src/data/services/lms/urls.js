import { StrictDict } from 'utils';
import { configuration } from 'config';
import { historyRecordLimit } from './constants';
import { filterQuery, stringifyUrl } from './utils';

const baseUrl = `${configuration.LMS_BASE_URL}`;

const courseId = window.location.pathname.split('/').filter(Boolean).pop() || '';

const api = `${baseUrl}/api/`;
const bulkGrades = `${api}bulk_grades/course/${courseId}/`;
const enrollment = `${api}enrollment/v1/`;
const grades = `${api}grades/v1/`;
const gradebook = `${grades}gradebook/${courseId}/`;
const bulkUpdate = `${gradebook}bulk-update`;
const intervention = `${bulkGrades}intervention/`;

const cohorts = `${baseUrl}/courses/${courseId}/cohorts/`;
const tracks = `${enrollment}course/${courseId}?include_expired=1`;
const bulkHistory = `${bulkGrades}history/`;

const assignmentTypes = stringifyUrl(`${gradebook}grading-info`, { graded_only: true });
const roles = stringifyUrl(`${enrollment}roles/`, { courseId });

/**
 * bulkGradesUrlByCourseAndRow(courseId, rowId)
 * returns the bulkGrades url with the given rowId.
 * @param {string} rowId - row/error identifier
 * @return {string} - bulk grades fetch url
 */
export const bulkGradesUrlByRow = (rowId) => stringifyUrl(bulkGrades, { error_id: rowId });

export const gradeCsvUrl = (options = {}) => stringifyUrl(bulkGrades, filterQuery(options));

export const interventionExportCsvUrl = (options = {}) => (
  stringifyUrl(intervention, filterQuery(options))
);

export const sectionOverrideHistoryUrl = (subsectionId, userId) => stringifyUrl(
  `${grades}subsection/${subsectionId}/`,
  { user_id: userId, history_record_limit: historyRecordLimit },
);

export default StrictDict({
  assignmentTypes,
  bulkGrades,
  bulkHistory,
  bulkUpdate,
  cohorts,
  enrollment,
  grades,
  gradebook,
  intervention,
  roles,
  tracks,

  bulkGradesUrlByRow,
  gradeCsvUrl,
  interventionExportCsvUrl,
  sectionOverrideHistoryUrl,
});
