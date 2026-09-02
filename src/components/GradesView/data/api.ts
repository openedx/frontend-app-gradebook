import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

import lms from 'data/services/lms';
import GRADE_OVERRIDE_HISTORY_ERROR_DEFAULT_MSG from 'data/constants/errors';
import { formatGradeOverrideForDisplay } from 'data/selectors/grades';

/**
 * getGrades({ searchText, cohort, track, options })
 * Fetches the gradebook rows for the current filter selection. Params mirror the
 * legacy `fetchGrades` thunk (which reads them from Redux); returns the raw
 * response body (results/previous/next/counts) — sorting/shaping happens in the
 * consumer, matching the old `fetching.received` handling.
 */
export const getGrades = async ({
  searchText,
  cohort,
  track,
  options,
}: {
  searchText: string | null;
  cohort: unknown;
  track: unknown;
  options: Record<string, unknown>;
}) => {
  const { data } = await lms.api.fetch.gradebookData(searchText, cohort, track, options);
  return data;
};

/**
 * getGradesPage(endpoint)
 * Fetches a specific grades page by its opaque prev/next cursor URL (taken from a
 * prior response's `previous`/`next`). Returns the raw response body, the same
 * shape as `getGrades`. Mirrors the legacy `fetchPrevNextGrades` thunk.
 */
export const getGradesPage = async (endpoint: string) => {
  const { data } = await getAuthenticatedHttpClient().get(endpoint);
  return data;
};

/** Grade-override history for one learner on one subsection (display-shaped). */
export interface GradeOverrideHistory {
  overrideHistory: Array<{ date: string; grader: string; reason: string; adjustedGrade: unknown }>;
  currentEarnedAllOverride: number | null;
  currentPossibleAllOverride: number | null;
  currentEarnedGradedOverride: number | null;
  currentPossibleGradedOverride: number | null;
  originalGradeEarnedAll: number | null;
  originalGradePossibleAll: number | null;
  originalGradeEarnedGraded: number | null;
  originalGradePossibleGraded: number | null;
}

/**
 * getGradeOverrideHistory(subsectionId, userId)
 * Fetches and shapes the grade-override history for a learner/subsection. Mirrors
 * the legacy thunk: throws the default message on a network error, and the
 * server-provided message (or the default) when the API reports `success: false`.
 */
export const getGradeOverrideHistory = async (
  subsectionId: string,
  userId: string | number,
): Promise<GradeOverrideHistory> => {
  let data;
  try {
    ({ data } = await lms.api.fetch.gradeOverrideHistory(subsectionId, userId));
  } catch (e) {
    throw new Error(GRADE_OVERRIDE_HISTORY_ERROR_DEFAULT_MSG);
  }
  if (!data.success) {
    throw new Error(data.error_message || GRADE_OVERRIDE_HISTORY_ERROR_DEFAULT_MSG);
  }
  return {
    overrideHistory: formatGradeOverrideForDisplay(data.history),
    currentEarnedAllOverride: data.override ? data.override.earned_all_override : null,
    currentPossibleAllOverride: data.override ? data.override.possible_all_override : null,
    currentEarnedGradedOverride: data.override ? data.override.earned_graded_override : null,
    currentPossibleGradedOverride: data.override ? data.override.possible_graded_override : null,
    originalGradeEarnedAll: data.original_grade ? data.original_grade.earned_all : null,
    originalGradePossibleAll: data.original_grade ? data.original_grade.possible_all : null,
    originalGradeEarnedGraded: data.original_grade ? data.original_grade.earned_graded : null,
    originalGradePossibleGraded: data.original_grade ? data.original_grade.possible_graded : null,
  };
};
