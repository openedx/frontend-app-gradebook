import { configuration } from 'config';

export const baseUrl = `${configuration.LMS_BASE_URL}/api`;

/**
 * bulkGradesUrlByCourseAndRow(courseId, rowId)
 * returns the bulkGrades url with the given courseId and rowId.
 * @param {string} courseId - course identifier
 * @param {string} rowId - row/error identifier
 * @return {string} - bulk grades fetch url
 */
export const bulkGradesUrlByCourseAndRow = (courseId, rowId) => (
  `${baseUrl}/bulkGrades/course/${courseId}/?error_id=${rowId}`
);
