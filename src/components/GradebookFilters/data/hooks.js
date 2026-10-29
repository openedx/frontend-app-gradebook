import { useFilters } from '@src/data/filtersContext';
import { useCourseIdWithGate } from '@src/data/apiHook';
import { minGrade, maxGrade } from '@src/components/GradesView/data/utils';

import { useCohorts, useTracks } from './apiHook';

// Stable empty reference so these reads don't return a fresh array each render
// while their query is still loading.
const EMPTY_ARRAY = [];

/**
 * gradeLimitsValidity(min, max, upperLimit)
 * returns { isMaxValid, isMinValid, isRangeValid } for a pair of grade filter limits.
 * Each limit must be a number not less than minGrade (0) and not more than upperLimit.
 * The range (min <= max) is only checked once both limits are valid.
 */
const gradeLimitsValidity = (min, max, upperLimit = Infinity) => {
  const minValue = parseInt(min, 10);
  const maxValue = parseInt(max, 10);
  const isLimitValid = (value) => value >= minGrade && value <= upperLimit;
  const isMinValid = isLimitValid(minValue);
  const isMaxValid = isLimitValid(maxValue);
  return {
    isMaxValid,
    isMinValid,
    isRangeValid: !(isMinValid && isMaxValid) || minValue <= maxValue,
  };
};

const areLimitsValid = ({ isMaxValid, isMinValid, isRangeValid }) => (
  isMaxValid && isMinValid && isRangeValid
);

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
 * useAssignmentGradeFilterValidity()
 * Validity of the (live) assignment-grade min/max inputs.
 * There is no upper bound: a grade override can exceed the possible points of an assignment.
 */
export const useAssignmentGradeFilterValidity = () => {
  const { assignmentGradeMin, assignmentGradeMax } = useFilters();
  return gradeLimitsValidity(assignmentGradeMin, assignmentGradeMax);
};

/**
 * useAreAssignmentGradeFiltersValid()
 * Whether both assignment-grade limits are valid and min <= max (gates the Apply button).
 */
export const useAreAssignmentGradeFiltersValid = () => (
  areLimitsValid(useAssignmentGradeFilterValidity())
);

/**
 * useCourseGradeFilterValidity()
 * Validity of the (live) course-grade min/max inputs, each between 0 and 100.
 */
export const useCourseGradeFilterValidity = () => {
  const { courseGradeMin, courseGradeMax } = useFilters();
  return gradeLimitsValidity(courseGradeMin, courseGradeMax, maxGrade);
};

/**
 * useAreCourseGradeFiltersValid()
 * Whether both course-grade limits are valid and min <= max (gates the Apply button).
 */
export const useAreCourseGradeFiltersValid = () => (
  areLimitsValid(useCourseGradeFilterValidity())
);
