import lms from 'data/services/lms';

/**
 * getBulkOperationHistory()
 * Fetches the bulk grade-override upload history for the course.
 */
export const getBulkOperationHistory = async () => lms.api.fetch.gradeBulkOperationHistory();
