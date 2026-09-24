import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import lms from '@src/data/services/lms';
import { sortAlphaAsc } from '@src/data/formatUtils';
import { filtersSnapshot } from '@src/data/filtersSnapshot';
import { useGradebookUi } from '@src/data/gradebookUiContext';
import { useCourseIdWithGate } from '@src/data/apiHook';
import { useCourseId } from '@src/data/courseIdContext';
import {
  trackGradesDisplayed,
  trackGradeOverrideSucceeded,
  trackGradeOverrideFailed,
  trackUploadOverrideSucceeded,
  trackUploadOverrideFailed,
} from '@src/data/services/segment/events';
// Cross-feature invalidation: a successful CSV upload refreshes the bulk-operation
// history owned by the BulkManagementHistoryView feature.
import { bulkOperationHistoryQueryKeys } from '@src/components/BulkManagementHistoryView/data/queryKeys';

import { getGradeOverrideHistory, getGrades, getGradesPage } from './api';
import { gradeOverrideHistoryQueryKeys, gradesQueryKeys } from './queryKeys';
import { buildGradesFetchParams } from './utils';

/**
 * Builds the `getGrades` params from the live `filtersSnapshot`. Reads at fetch
 * time (not from the query key) so imperative refetches pick up the latest
 * filter values — the FiltersProvider keeps `filtersSnapshot` in sync.
 */
const buildGradebookDataParams = () => buildGradesFetchParams(filtersSnapshot);

/**
 * useGrades()
 * Single-responsibility query for the main gradebook rows. Caller supplies
 * `courseId`, the current pagination cursor (`gradesPageEndpoint` from
 * `GradebookUi`, or `null` for the base/unpaged page), and decides when it may
 * run via `enabled`. The base grades key is a prefix of the paged key, so
 * invalidating `byCourse(courseId)` still refetches any page. The first
 * (unpaged) page reads the current filter params at fetch time (so an
 * imperative `invalidateQueries` on filter apply / search refetches with the
 * latest values); a non-null cursor fetches that opaque prev/next URL —
 * replacing the legacy `fetchPrevNextGrades` thunk.
 */
export const useGrades = (
  courseId: string,
  gradesPageEndpoint: string | null,
  { enabled = true }: { enabled?: boolean } = {},
) => useQuery({
  queryKey: [...gradesQueryKeys.byCourse(courseId), gradesPageEndpoint ?? 'base'],
  queryFn: async () => {
    const data = gradesPageEndpoint
      ? await getGradesPage(gradesPageEndpoint)
      : await getGrades({ courseId, ...buildGradebookDataParams() });
    // Mirrors the legacy `receivedGrades` redux-beacon trigger: one event per
    // actual fetch, with the filters it ran under and the resulting cursors.
    trackGradesDisplayed({
      assignmentType: filtersSnapshot.assignmentType,
      cohort: filtersSnapshot.cohort,
      track: filtersSnapshot.track,
      prev: data.previous,
      next: data.next,
    });
    return data;
  },
  enabled: !!courseId && enabled,
});

/** One subsection cell within a learner's grade row. */
export interface SubsectionBreakdown {
  label: string;
  category?: string;
  subsection_name?: string;
  module_id?: string;
  score_possible?: number;
  score_earned?: number;
  percent?: number;
  attempted?: boolean;
  [key: string]: unknown;
}

/** One learner's grade row from the gradebook response. */
export interface GradeEntry {
  user_id?: number;
  username?: string;
  external_user_key?: string;
  email?: string;
  percent?: number;
  section_breakdown: SubsectionBreakdown[];
  [key: string]: unknown;
}

/** Shaped grades read-model derived from the `useGrades` query. */
export interface GradesData {
  results: GradeEntry[];
  prevPage: string | null;
  nextPage: string | null;
  totalUsersCount: number;
  filteredUsersCount: number;
  isFetching: boolean;
  isError: boolean;
  isSuccess: boolean;
}

/**
 * useGradesData()
 * Shapes the `useGrades` query into the read-model the grades table / counts /
 * pagination consume — the React Query equivalent of the Redux `grades` slice
 * fields that `useGradebookData` used to mirror. Results are sorted by username
 * (matching the legacy `fetching.received` handling).
 */
export const useGradesData = (): GradesData => {
  const { courseId, enabled } = useCourseIdWithGate();
  const { gradesPageEndpoint } = useGradebookUi();
  const query = useGrades(courseId, gradesPageEndpoint, { enabled });
  const data = query.data as {
    results?: GradeEntry[];
    previous?: string | null;
    next?: string | null;
    total_users_count?: number;
    filtered_users_count?: number;
  } | undefined;
  const results = useMemo(
    () => [...(data?.results ?? [])].sort(sortAlphaAsc),
    [data],
  );
  return {
    results,
    prevPage: data?.previous ?? null,
    nextPage: data?.next ?? null,
    totalUsersCount: data?.total_users_count ?? 0,
    filteredUsersCount: data?.filtered_users_count ?? 0,
    isFetching: query.isFetching,
    isError: query.isError,
    isSuccess: query.isSuccess,
  };
};

/**
 * useGradeOverrideHistory(subsectionId, userId)
 * Grade-override history for a single learner/subsection, used by the edit modal.
 * Enabled only once both identifiers are present (i.e. the modal has been opened
 * for a specific cell). `retry: false` because a `success: false` business error
 * is not worth retrying.
 */
export const useGradeOverrideHistory = (subsectionId?: string, userId?: string | number) => (
  useQuery({
    queryKey: gradeOverrideHistoryQueryKeys.byCell(subsectionId ?? null, userId ?? null),
    queryFn: () => getGradeOverrideHistory(subsectionId as string, userId as string | number),
    enabled: !!subsectionId && userId !== undefined && userId !== null,
    retry: false,
  })
);

/** Shape of the rejection thrown by `uploadGradeCsv` (an HTTP response, not an Error). */
interface CsvUploadError {
  status?: number;
  data?: { error_messages?: string[]; saved?: number; total?: number };
}

/** One grade-override entry sent to the gradebook bulk-update endpoint. */
interface GradeOverrideUpdate {
  grade: {
    comment: string;
    earned_graded_override: string | number;
  };
  usage_id: string | null;
  user_id: number | null;
}

/**
 * useUpdateGrades()
 * Grade-override save from the edit modal. The HTTP call runs through React Query;
 * success emits the Segment `update.*` event, shows the success banner, resets to
 * the first grades page, and invalidates the grades query (so the table reflects
 * the override) and the edited cell's override history (so reopening the modal
 * shows the new entry).
 *
 * The payload is captured as mutation variables when the trigger is called (same
 * shape as the old `selectors.app.editUpdateData`): the caller closes the modal
 * right after triggering the save, and a pending mutation picks up re-rendered
 * options, so a closure over `modalState` would read the reset (empty) state.
 *
 * Returns a no-arg trigger to match the legacy `useUpdateGrades()` call site.
 */
export const useUpdateGrades = () => {
  const queryClient = useQueryClient();
  const courseId = useCourseId();
  const { setShowSuccess, setGradesPageEndpoint, modalState } = useGradebookUi();
  const mutation = useMutation({
    mutationFn: (updateData: GradeOverrideUpdate[]) => lms.api.updateGradebookData(courseId, updateData),
    onSuccess: ({ data }, updateData) => {
      trackGradeOverrideSucceeded(data);
      setShowSuccess(true);
      setGradesPageEndpoint(null);
      queryClient.invalidateQueries({
        queryKey: gradesQueryKeys.byCourse(courseId),
      });
      updateData.forEach(({ usage_id: usageId, user_id: userId }) => {
        queryClient.invalidateQueries({
          queryKey: gradeOverrideHistoryQueryKeys.byCell(usageId, userId),
        });
      });
    },
    onError: (error) => {
      trackGradeOverrideFailed(error);
    },
  });
  return () => {
    mutation.mutate([{
      grade: {
        comment: modalState.reasonForChange,
        earned_graded_override: modalState.adjustedGradeValue,
      },
      usage_id: modalState.updateModuleId,
      user_id: modalState.updateUserId,
    }]);
  };
};

/**
 * useSubmitImportGradesButtonData()
 * Bulk grade-override CSV upload. The upload runs through React Query and, on
 * success, invalidates the bulk-operation-history query so the new upload shows up.
 * CSV progress/results/toast are React UI state (GradebookUi context) and success/
 * failure emit the Segment `uploadOverride.*` events.
 *
 * Returns `(formData) => Promise` whose promise always resolves (errors are handled
 * inside `onError`), matching the legacy thunk so the caller's `.then(clearInput)`
 * still runs on both success and failure.
 */
export const useSubmitImportGradesButtonData = () => {
  const queryClient = useQueryClient();
  const courseId = useCourseId();
  const {
    setShowImportSuccessToast,
    resetCsvUpload,
    markCsvUploadSuccess,
    setCsvUploadErrors,
  } = useGradebookUi();
  const mutation = useMutation<unknown, CsvUploadError, FormData>({
    mutationFn: (formData) => lms.api.uploadGradeCsv(courseId, formData),
    onMutate: () => {
      resetCsvUpload();
    },
    onSuccess: () => {
      markCsvUploadSuccess();
      setShowImportSuccessToast(true);
      trackUploadOverrideSucceeded();
      queryClient.invalidateQueries({
        queryKey: bulkOperationHistoryQueryKeys.byCourse(courseId),
      });
    },
    onError: (error) => {
      trackUploadOverrideFailed(error);
      if (error?.status === 200 && error?.data?.error_messages?.length) {
        const { error_messages: errorMessages } = error.data;
        setCsvUploadErrors(errorMessages);
      } else {
        setCsvUploadErrors(['Unknown error.']);
      }
    },
  });
  return (formData: FormData) => mutation.mutateAsync(formData).catch(() => {});
};
