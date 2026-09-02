import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import { useAssignmentTypes, useCanUserViewGradebook } from 'data/apiHook';
import { transformHistoryEntry } from 'data/selectors/grades';

import { getBulkOperationHistory } from './api';
import { bulkOperationHistoryQueryKeys } from './queryKeys';

// Stable empty reference so the shaped read-model hook doesn't return a fresh
// array on every render while the query is still loading.
const EMPTY_ARRAY: never[] = [];

/**
 * useBulkOperationHistory()
 * Bulk grade-override upload history. Disabled until the roles query resolves
 * truthy and the assignment-types query reports bulk management is available.
 */
export const useBulkOperationHistory = () => {
  const { courseId = '' } = useParams();
  const { data: canViewGradebook } = useCanUserViewGradebook();
  const { data: assignmentTypesData } = useAssignmentTypes();
  return useQuery({
    queryKey: bulkOperationHistoryQueryKeys.byCourse(courseId),
    queryFn: getBulkOperationHistory,
    enabled: !!courseId && !!canViewGradebook && !!assignmentTypesData?.bulkManagementAvailable,
  });
};

/**
 * useBulkManagementHistoryEntries()
 * Read-model for the history table: the query results shaped by
 * `transformHistoryEntry` (display filename / user / results summary). Replaces
 * the former facade selector `selectors.grades.useBulkManagementHistoryEntries`.
 */
export const useBulkManagementHistoryEntries = () => (
  (useBulkOperationHistory().data ?? EMPTY_ARRAY).map(transformHistoryEntry)
);
