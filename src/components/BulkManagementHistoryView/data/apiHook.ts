import { useQuery } from '@tanstack/react-query';

import { useAssignmentTypes, useCourseIdWithGate } from 'data/apiHook';

import { getBulkOperationHistory } from './api';
import { bulkOperationHistoryQueryKeys } from './queryKeys';
import { transformHistoryEntry } from './utils';

// Stable empty reference so the shaped read-model hook doesn't return a fresh
// array on every render while the query is still loading.
const EMPTY_ARRAY: never[] = [];

/**
 * useBulkOperationHistory()
 * Bulk grade-override upload history. Single-responsibility query hook: the
 * caller decides when it may run via `courseId` and `enabled`.
 */
export const useBulkOperationHistory = (
  courseId: string,
  { enabled = true }: { enabled?: boolean } = {},
) => useQuery({
  queryKey: bulkOperationHistoryQueryKeys.byCourse(courseId),
  queryFn: getBulkOperationHistory,
  enabled: !!courseId && enabled,
});

/**
 * useBulkManagementHistoryEntries()
 * Read-model for the history table: wires the roles + assignment-types gates
 * into `useBulkOperationHistory` and shapes the results with
 * `transformHistoryEntry`. Replaces the former facade selector
 * `selectors.grades.useBulkManagementHistoryEntries`.
 */
export const useBulkManagementHistoryEntries = () => {
  const { courseId, enabled } = useCourseIdWithGate();
  const { data: assignmentTypesData } = useAssignmentTypes(courseId, { enabled });
  const { data } = useBulkOperationHistory(courseId, {
    enabled: enabled && !!assignmentTypesData?.bulkManagementAvailable,
  });
  return (data ?? EMPTY_ARRAY).map(transformHistoryEntry);
};
