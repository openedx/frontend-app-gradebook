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
 * Gated on the roles query; returns assignment types plus the grades-frozen and
 * bulk-management flags.
 */
export const useAssignmentTypes = () => {
  const { courseId = '' } = useParams();
  const { data: canViewGradebook } = useCanUserViewGradebook();
  return useQuery({
    queryKey: assignmentTypesQueryKeys.byCourse(courseId),
    queryFn: getAssignmentTypes,
    enabled: !!courseId && !!canViewGradebook,
  });
};

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
 * useShowBulkManagement()
 * Whether bulk management is available for the course (derived from the
 * assignment-types query). Gates the header toggle + bulk-management controls.
 */
export const useShowBulkManagement = (): boolean => (
  !!useAssignmentTypes().data?.bulkManagementAvailable
);
