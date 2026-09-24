import lms from '@src/data/services/lms';

/**
 * getBulkOperationHistory(courseId)
 * Fetches the bulk grade-override upload history for the course.
 */
export const getBulkOperationHistory = async (courseId: string) => (
  lms.api.fetch.gradeBulkOperationHistory(courseId)
);
