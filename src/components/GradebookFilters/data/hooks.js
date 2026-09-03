import { useFilters } from 'data/filtersContext';
import { useCourseIdWithGate } from 'data/apiHook';

import { useCohorts, useTracks } from './apiHook';

// Stable empty reference so these reads don't return a fresh array each render
// while their query is still loading.
const EMPTY_ARRAY = [];

// Grade limits are valid when between 0 and 100 (mirrors the legacy
// `courseGradeFilterValidity` selector, which used minGrade='0'/maxGrade='100').
const isGradeValid = (value) => {
  const intValue = parseInt(value, 10);
  return intValue >= 0 && intValue <= 100;
};

/**
 * useSelectedCohortEntry()
 * The full cohort entry matching the currently-selected cohort id (from the
 * FiltersProvider), or undefined.
 */
export const useSelectedCohortEntry = () => {
  const { courseId, enabled } = useCourseIdWithGate();
  const cohortList = useCohorts(courseId, { enabled }).data ?? EMPTY_ARRAY;
  const { cohort: cohortId } = useFilters();
  return cohortList.find(({ id }) => id === parseInt(cohortId, 10));
};

/**
 * useSelectedTrackEntry()
 * The full track entry matching the currently-selected track slug (from the
 * FiltersProvider), or undefined.
 */
export const useSelectedTrackEntry = () => {
  const { courseId, enabled } = useCourseIdWithGate();
  const trackList = useTracks(courseId, { enabled }).data ?? EMPTY_ARRAY;
  const { track } = useFilters();
  return trackList.find(({ slug }) => slug === track);
};

/**
 * useCourseGradeFilterValidity()
 * Per-field validity of the (live) course-grade min/max inputs.
 */
export const useCourseGradeFilterValidity = () => {
  const { courseGradeMin, courseGradeMax } = useFilters();
  return { isMaxValid: isGradeValid(courseGradeMax), isMinValid: isGradeValid(courseGradeMin) };
};

/**
 * useAreCourseGradeFiltersValid()
 * Whether both course-grade limits are valid (gates the Apply button).
 */
export const useAreCourseGradeFiltersValid = () => {
  const { courseGradeMin, courseGradeMax } = useFilters();
  return isGradeValid(courseGradeMin) && isGradeValid(courseGradeMax);
};
