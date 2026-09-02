import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import { useCanUserViewGradebook } from 'data/apiHook';

import { getCohorts, getTracks } from './api';
import { cohortsQueryKeys, tracksQueryKeys } from './queryKeys';

/**
 * useCohorts()
 * Gated on the roles query; returns the course's cohorts.
 */
export const useCohorts = () => {
  const { courseId = '' } = useParams();
  const { data: canViewGradebook } = useCanUserViewGradebook();
  return useQuery({
    queryKey: cohortsQueryKeys.byCourse(courseId),
    queryFn: getCohorts,
    enabled: !!courseId && !!canViewGradebook,
  });
};

/**
 * useTracks()
 * Gated on the roles query; returns the course's enrollment tracks.
 */
export const useTracks = () => {
  const { courseId = '' } = useParams();
  const { data: canViewGradebook } = useCanUserViewGradebook();
  return useQuery({
    queryKey: tracksQueryKeys.byCourse(courseId),
    queryFn: getTracks,
    enabled: !!courseId && !!canViewGradebook,
  });
};
