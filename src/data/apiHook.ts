import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import { getAssignmentTypes, getCanUserViewGradebook } from './api';
import { assignmentTypesQueryKeys, rolesQueryKeys } from './queryKeys';

/**
 * useCanUserViewGradebook()
 * Query for the roles-based permission gate. This is the root of the fetch
 * cascade: the other server queries stay disabled until this resolves truthy,
 * mirroring the legacy `fetchRoles` -> fan-out behavior.
 */
export const useCanUserViewGradebook = () => {
  const { courseId = '' } = useParams();
  return useQuery({
    queryKey: rolesQueryKeys.byCourse(courseId),
    queryFn: () => getCanUserViewGradebook(courseId),
    enabled: !!courseId,
  });
};

/**
 * useAssignmentTypes()
 * Single-responsibility query for assignment types (types + grades-frozen +
 * bulk-management flags). Caller supplies `courseId` and decides when it may
 * run via `enabled`.
 */
export const useAssignmentTypes = (
  courseId: string,
  { enabled = true }: { enabled?: boolean } = {},
) => useQuery({
  queryKey: assignmentTypesQueryKeys.byCourse(courseId),
  queryFn: getAssignmentTypes,
  enabled: !!courseId && enabled,
});

/**
 * useCanViewGradebook()
 * The optimistic boolean read of the roles gate used by UI (header, spinner):
 * `true` while the roles query is still loading (the legacy Redux initial state
 * was `true`), the resolved value on success, `false` on error.
 */
export const useCanViewGradebook = (): boolean => {
  const { data, isError } = useCanUserViewGradebook();
  if (isError) { return false; }
  return data === undefined ? true : !!data;
};

/**
 * useCourseIdWithGate()
 * Shared gate for the downstream server queries: the routed `courseId` plus an
 * `enabled` flag that resolves truthy once `useCanUserViewGradebook` does.
 * Callers pass the returned pair into single-responsibility query hooks so the
 * gate rule lives in one place.
 */
export const useCourseIdWithGate = (): { courseId: string; enabled: boolean } => {
  const { courseId = '' } = useParams();
  const { data: canViewGradebook } = useCanUserViewGradebook();
  return { courseId, enabled: !!canViewGradebook };
};

/**
 * useShowBulkManagement()
 * Whether bulk management is available for the course (derived from the
 * assignment-types query). Gates the header toggle + bulk-management controls.
 */
export const useShowBulkManagement = (): boolean => {
  const { courseId, enabled } = useCourseIdWithGate();
  return !!useAssignmentTypes(courseId, { enabled }).data?.bulkManagementAvailable;
};
