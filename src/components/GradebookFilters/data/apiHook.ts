import { useQuery } from '@tanstack/react-query';

import { getCohorts, getTracks } from './api';
import { cohortsQueryKeys, tracksQueryKeys } from './queryKeys';

/**
 * useCohorts()
 * Single-responsibility query for the course's cohorts. Caller supplies
 * `courseId` and decides when it may run via `enabled`.
 */
export const useCohorts = (
  courseId: string,
  { enabled = true }: { enabled?: boolean } = {},
) => useQuery({
  queryKey: cohortsQueryKeys.byCourse(courseId),
  queryFn: getCohorts,
  enabled: !!courseId && enabled,
});

/**
 * useTracks()
 * Single-responsibility query for the course's enrollment tracks. Caller
 * supplies `courseId` and decides when it may run via `enabled`.
 */
export const useTracks = (
  courseId: string,
  { enabled = true }: { enabled?: boolean } = {},
) => useQuery({
  queryKey: tracksQueryKeys.byCourse(courseId),
  queryFn: getTracks,
  enabled: !!courseId && enabled,
});
