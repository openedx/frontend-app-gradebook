import { BASE_KEY } from '@src/data/queryKeys';

/** Bulk grade-override upload history for the course. */
export const bulkOperationHistoryQueryKeys = {
  all: BASE_KEY,
  byCourse: (courseId: string) => [...BASE_KEY, courseId, 'bulkOperationHistory'] as const,
};
