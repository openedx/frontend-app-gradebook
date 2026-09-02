import { useMemo } from 'react';
import { useIsMutating, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import selectors from 'data/selectors';
import lms from 'data/services/lms';
import initialFilters, { filterConfig, filters as filterNames } from 'data/constants/filters';
import { useFilters } from 'data/filtersContext';
import { useGradebookUi } from 'data/gradebookUiContext';
import { useCanViewGradebook } from 'data/apiHook';
import {
  useSelectedCohortEntry,
  useSelectedTrackEntry,
} from 'components/GradebookFilters/data/hooks';

import { useGradesData, useGradeOverrideHistory } from './apiHook';
import { gradesQueryKeys } from './queryKeys';

// Stable empty reference so read hooks don't return a fresh array each render.
const EMPTY_ARRAY = [];

/**
 * useGradesHeadings()
 * The gradebook table headings for the current assignment-type / assignment
 * filters, derived from the grades query's section breakdown.
 */
export const useGradesHeadings = () => {
  const { results } = useGradesData();
  const { assignmentType, assignment: assignmentId } = useFilters();
  return useMemo(() => {
    const { relevantAssignmentDataFromResults, getAssignmentsFromResultsSubstate } = selectors.filters;
    const selectedAssignmentLabel = relevantAssignmentDataFromResults(results, assignmentId)?.label;
    const sectionBreakdown = getAssignmentsFromResultsSubstate(results);
    return selectors.grades.headingMapper(
      assignmentType || 'All',
      selectedAssignmentLabel || 'All',
    )(sectionBreakdown);
  }, [results, assignmentType, assignmentId]);
};

/**
 * useSelectableAssignmentLabels()
 * The assignment options for the assignment dropdown, derived from the grades
 * results and filtered by the current assignment-type.
 */
export const useSelectableAssignmentLabels = () => {
  const { results } = useGradesData();
  const { assignmentType } = useFilters();
  return useMemo(() => {
    const all = selectors.filters.getAssignmentsFromResultsSubstate(results)
      .map(selectors.filters.chooseRelevantAssignmentData);
    return (assignmentType && assignmentType !== 'All')
      ? all.filter((assignment) => assignment.type === assignmentType)
      : all;
  }, [results, assignmentType]);
};

/**
 * useSelectedAssignmentLabel()
 * The label of the currently-selected assignment (from the grades results).
 */
export const useSelectedAssignmentLabel = () => {
  const { results } = useGradesData();
  const { assignment: assignmentId } = useFilters();
  return useMemo(
    () => selectors.filters.relevantAssignmentDataFromResults(results, assignmentId)?.label,
    [results, assignmentId],
  );
};

/**
 * useShouldShowSpinner()
 * The busy indicator: the roles gate combined with the grades query fetching or
 * any in-flight mutation (grade override save / CSV upload).
 */
export const useShouldShowSpinner = () => {
  const canViewGradebook = useCanViewGradebook();
  const { isFetching } = useGradesData();
  const mutatingCount = useIsMutating();
  return canViewGradebook && (isFetching || mutatingCount > 0);
};

/**
 * useAllGrades()
 * The (sorted) grades rows for the table.
 */
export const useAllGrades = () => useGradesData().results;

/**
 * useUserCounts()
 * Filtered/total user counts from the grades query.
 */
export const useUserCounts = () => {
  const { filteredUsersCount, totalUsersCount } = useGradesData();
  return { filteredUsersCount, totalUsersCount };
};

/**
 * useGradeData()
 * The pagination cursors + counts (from the grades query) plus the current
 * `gradeFormat` (from the GradebookUi context).
 */
export const useGradeData = () => {
  const {
    nextPage, prevPage, totalUsersCount, filteredUsersCount,
  } = useGradesData();
  const { gradeFormat } = useGradebookUi();
  return {
    nextPage, prevPage, totalUsersCount, filteredUsersCount, gradeFormat,
  };
};

// Export URL args, built from the FiltersProvider (applied grade limits + the
// immediate filters) and the selected cohort name. Reuses the pure
// `selectors.grades.format*` helpers so the CSV/intervention URL formatting is
// unchanged.
const useLmsApiServiceArgs = () => {
  const {
    assignment, assignmentType, track, includeCourseRoleMembers,
    appliedAssignmentGradeMin, appliedAssignmentGradeMax,
    appliedCourseGradeMin, appliedCourseGradeMax,
  } = useFilters();
  const selectedCohort = useSelectedCohortEntry();
  const assignmentId = assignment || undefined;
  const opts = { assignmentId };
  const {
    formatMinAssignmentGrade, formatMaxAssignmentGrade,
    formatMinCourseGrade, formatMaxCourseGrade,
  } = selectors.grades;
  return {
    cohort: selectedCohort ? selectedCohort.name : undefined,
    track,
    assignment: assignmentId,
    assignmentType,
    assignmentGradeMin: formatMinAssignmentGrade(appliedAssignmentGradeMin, opts),
    assignmentGradeMax: formatMaxAssignmentGrade(appliedAssignmentGradeMax, opts),
    courseGradeMin: formatMinCourseGrade(appliedCourseGradeMin),
    courseGradeMax: formatMaxCourseGrade(appliedCourseGradeMax),
    excludedCourseRoles: includeCourseRoleMembers ? '' : 'all',
  };
};

export const useGradeExportUrl = () => lms.urls.gradeCsvUrl(useLmsApiServiceArgs());
export const useInterventionExportUrl = () => lms.urls.interventionExportCsvUrl(useLmsApiServiceArgs());

/**
 * useFilterBadgeConfig(filterName)
 * The badge config (value + isDefault) for a given filter, built from the
 * FiltersProvider (immediate filters + applied grade limits + query-derived
 * assignment label) and the selected cohort/track names. Reuses `filterConfig` +
 * the pure `selectors.filters.isDefault` so formatting is unchanged.
 */
export const useFilterBadgeConfig = (filterName) => {
  const selectedCohort = useSelectedCohortEntry();
  const selectedTrack = useSelectedTrackEntry();
  const selectedAssignmentLabel = useSelectedAssignmentLabel();
  const {
    assignmentType, includeCourseRoleMembers,
    appliedAssignmentGradeMin, appliedAssignmentGradeMax,
    appliedCourseGradeMin, appliedCourseGradeMax,
  } = useFilters();

  if (filterName === filterNames.cohort || filterName === filterNames.track) {
    const entry = filterName === filterNames.cohort ? selectedCohort : selectedTrack;
    const value = entry ? entry.name : '';
    return {
      ...filterConfig[filterName],
      value,
      isDefault: value === initialFilters[filterName],
    };
  }

  const { isDefault } = selectors.filters;
  const { filterOrder, ...config } = filterConfig[filterName];

  if (filterOrder) {
    const [min, max] = filterName === filterNames.assignmentGrade
      ? [appliedAssignmentGradeMin, appliedAssignmentGradeMax]
      : [appliedCourseGradeMin, appliedCourseGradeMax];
    return {
      ...config,
      value: `${min} - ${max}`,
      isDefault: isDefault(filterOrder[0], min) && isDefault(filterOrder[1], max),
    };
  }

  const singleValues = {
    [filterNames.assignmentType]: assignmentType,
    [filterNames.assignment]: selectedAssignmentLabel || '',
    [filterNames.includeCourseRoleMembers]: includeCourseRoleMembers,
  };
  const value = singleValues[filterName];
  return { ...config, value, isDefault: isDefault(filterName, value) };
};

/**
 * useGradeOverrideData()
 * The edit-modal override read-model, sourced from the override-history query
 * gated on the modal's subsection/user ids (from the GradebookUi context).
 */
export const useGradeOverrideData = () => {
  const { modalState } = useGradebookUi();
  const query = useGradeOverrideHistory(modalState.updateModuleId, modalState.updateUserId);
  const { data } = query;
  return {
    gradeOverrideHistoryResults: data?.overrideHistory ?? EMPTY_ARRAY,
    gradeOverrideCurrentEarnedGradedOverride: data?.currentEarnedGradedOverride ?? null,
    gradeOriginalEarnedGraded: data?.originalGradeEarnedGraded ?? null,
    gradeOriginalPossibleGraded: data?.originalGradePossibleGraded ?? null,
    gradeOverrideHistoryError: query.isError ? (query.error?.message || '') : '',
    hasOverrideErrors: query.isError,
  };
};

/**
 * useEditModalPossibleGrade()
 * The edit-modal "possible" grade: the context `adjustedGradePossible` or, as a
 * fallback, the override query's original possible-graded value.
 */
export const useEditModalPossibleGrade = () => {
  const { modalState } = useGradebookUi();
  const { gradeOriginalPossibleGraded } = useGradeOverrideData();
  return modalState.adjustedGradePossible || gradeOriginalPossibleGraded;
};

// Invalidate the main grades query, causing the mounted `useGrades` observer to
// refetch with the current filters.
const useInvalidateGrades = () => {
  const queryClient = useQueryClient();
  const { courseId = '' } = useParams();
  return () => queryClient.invalidateQueries({ queryKey: gradesQueryKeys.byCourse(courseId) });
};

/**
 * useRefetchGrades()
 * Refetches the grades query from the first (unpaged) page with the latest
 * filters. Clearing the pagination cursor changes the query key (auto-fetch); if
 * already on the base page, invalidate to force a refetch.
 */
export const useRefetchGrades = () => {
  const invalidateGrades = useInvalidateGrades();
  const { gradesPageEndpoint, setGradesPageEndpoint } = useGradebookUi();
  return () => {
    if (gradesPageEndpoint !== null) {
      setGradesPageEndpoint(null);
    } else {
      invalidateGrades();
    }
  };
};

/**
 * useFetchGradesIfAssignmentGradeFiltersSet()
 * Refetches from the start only when a non-default applied assignment-grade limit
 * is set (mirrors the legacy `areAssignmentGradeFiltersSet` gate).
 */
export const useFetchGradesIfAssignmentGradeFiltersSet = () => {
  const refetchFromStart = useRefetchGrades();
  const { appliedAssignmentGradeMin, appliedAssignmentGradeMax } = useFilters();
  return () => {
    const isSet = appliedAssignmentGradeMin !== initialFilters.assignmentGradeMin
      || appliedAssignmentGradeMax !== initialFilters.assignmentGradeMax;
    if (isSet) {
      refetchFromStart();
    }
  };
};

/**
 * useFetchPrevNextGrades()
 * Pagination trigger: sets the page cursor in the GradebookUi context (the
 * `useGrades` query keys off it and fetches that opaque prev/next URL).
 */
export const useFetchPrevNextGrades = () => {
  const { setGradesPageEndpoint } = useGradebookUi();
  return (endpoint) => { setGradesPageEndpoint(endpoint); };
};
