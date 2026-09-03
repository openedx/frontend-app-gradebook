import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import lms from 'data/services/lms';
import { sortAlphaAsc } from 'data/formatUtils';
import { filtersSnapshot } from 'data/filtersSnapshot';
import { useGradebookUi } from 'data/gradebookUiContext';
import { useCourseIdWithGate } from 'data/apiHook';
import {
  trackGradeOverrideSucceeded,
  trackGradeOverrideFailed,
  trackUploadOverrideSucceeded,
  trackUploadOverrideFailed,
} from 'data/services/segment/events';
// Cross-feature invalidation: a successful CSV upload refreshes the bulk-operation
// history owned by the BulkManagementHistoryView feature.
import { bulkOperationHistoryQueryKeys } from 'components/BulkManagementHistoryView/data/queryKeys';

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
  queryFn: () => (
    gradesPageEndpoint
      ? getGradesPage(gradesPageEndpoint)
      : getGrades(buildGradebookDataParams())
  ),
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

/**
 * useUpdateGrades()
 * Grade-override save from the edit modal. The HTTP call runs through React Query;
 * success emits the Segment `update.*` event, shows the success banner, resets to
 * the first grades page, and invalidates the grades query so the table reflects the
 * override. Reads the edit payload from the GradebookUi context at mutate time.
 *
 * Returns a no-arg trigger to match the legacy `useUpdateGrades()` call site.
 */
export const useUpdateGrades = () => {
  const queryClient = useQueryClient();
  const { courseId = '' } = useParams();
  const { setShowSuccess, setGradesPageEndpoint, modalState } = useGradebookUi();
  const mutation = useMutation({
    // Build the override payload from the context modalState (same shape as the old
    // `selectors.app.editUpdateData`). The closure reads the latest modalState
    // because the hook re-renders on context change before the save is triggered.
    mutationFn: () => lms.api.updateGradebookData([{
      grade: {
        comment: modalState.reasonForChange,
        earned_graded_override: modalState.adjustedGradeValue,
      },
      usage_id: modalState.updateModuleId,
      user_id: modalState.updateUserId,
    }]),
    onSuccess: ({ data }) => {
      trackGradeOverrideSucceeded(data);
      setShowSuccess(true);
      setGradesPageEndpoint(null);
      queryClient.invalidateQueries({
        queryKey: gradesQueryKeys.byCourse(courseId),
      });
    },
    onError: (error) => {
      trackGradeOverrideFailed(error);
    },
  });
  return () => { mutation.mutate(); };
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
  const { courseId = '' } = useParams();
  const {
    setShowImportSuccessToast,
    resetCsvUpload,
    markCsvUploadSuccess,
    setCsvUploadErrors,
  } = useGradebookUi();
  const mutation = useMutation<unknown, CsvUploadError, FormData>({
    mutationFn: (formData) => lms.api.uploadGradeCsv(formData),
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
