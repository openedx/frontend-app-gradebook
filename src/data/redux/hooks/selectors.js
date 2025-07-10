import { useSelector } from 'react-redux';

import { StrictDict } from 'utils';
import selectors from 'data/selectors';

const selectorHook = (selector) => () => useSelector(selector);

export const root = StrictDict({
  useEditModalPossibleGrade: selectorHook(selectors.root.editModalPossibleGrade),
  useGetHeadings: selectorHook(selectors.root.getHeadings),
  useGradeExportUrl: selectorHook(selectors.root.gradeExportUrl),
  useInterventionExportUrl: selectorHook(selectors.root.interventionExportUrl),
  useSelectedCohortEntry: selectorHook(selectors.root.selectedCohortEntry),
  useSelectedTrackEntry: selectorHook(selectors.root.selectedTrackEntry),
  useShouldShowSpinner: selectorHook(selectors.root.shouldShowSpinner),
  useShowBulkManagement: selectorHook(selectors.root.showBulkManagement),
  useFilterBadgeConfig: (filterName) => useSelector(
    (state) => selectors.root.filterBadgeConfig(state, filterName),
  ),
});

export const app = StrictDict({
  useActiveView: selectorHook(selectors.app.activeView),
  useAssignmentGradeLimits: selectorHook(selectors.app.assignmentGradeLimits),
  useAreCourseGradeFiltersValid: selectorHook(selectors.app.areCourseGradeFiltersValid),
  useAreAssignmentGradeFiltersValid: selectorHook(selectors.app.areAssignmentGradeFiltersValid),
  useCourseGradeLimits: selectorHook(selectors.app.courseGradeLimits),
  useCourseGradeFilterValidity: selectorHook(selectors.app.courseGradeFilterValidity),
  useAssignmentGradeFilterValidity: selectorHook(selectors.app.assignmentGradeFilterValidity),
  useCourseId: selectorHook(selectors.app.courseId),
  useModalData: selectorHook(selectors.app.modalData),
  useSearchValue: selectorHook(selectors.app.searchValue),
  useShowImportSuccessToast: selectorHook(selectors.app.showImportSuccessToast),
});

export const assignmentTypes = StrictDict({
  useAllAssignmentTypes: selectorHook(selectors.assignmentTypes.allAssignmentTypes),
  useAreGradesFrozen: selectorHook(selectors.assignmentTypes.areGradesFrozen),
});

export const cohorts = StrictDict({
  useAllCohorts: selectorHook(selectors.cohorts.allCohorts),
  // maybe not needed?
  useCohortsByName: selectorHook(selectors.cohorts.cohortsByName),
});

export const filters = StrictDict({
  useData: selectorHook(selectors.filters.allFilters),
  useIncludeCourseRoleMembers: selectorHook(selectors.filters.includeCourseRoleMembers),
  useSelectableAssignmentLabels: selectorHook(selectors.filters.selectableAssignmentLabels),
  useSelectedAssignmentLabel: selectorHook(selectors.filters.selectedAssignmentLabel),
  useAssignmentType: selectorHook(selectors.filters.assignmentType),
});

export const grades = StrictDict({
  useAllGrades: selectorHook(selectors.grades.allGrades),
  useUserCounts: () => ({
    filteredUsersCount: useSelector(selectors.grades.filteredUsersCount),
    totalUsersCount: useSelector(selectors.grades.totalUsersCount),
  }),
  useGradeData: selectorHook(selectors.grades.gradeData),
  useHasOverrideErrors: selectorHook(selectors.grades.hasOverrideErrors),
  useShowSuccess: selectorHook(selectors.grades.showSuccess),
  useSubsectionGrade: ({ gradeFormat, subsection }) => () => (
    selectors.grades.subsectionGrade[gradeFormat](subsection)
  ),
});

export const roles = StrictDict({
  useCanUserViewGradebook: selectorHook(selectors.roles.canUserViewGradebook),
});

export const tracks = StrictDict({
  useAllTracks: selectorHook(selectors.tracks.allTracks),
  // maybe not needed?
  useTracksByName: selectorHook(selectors.tracks.tracksByName),
});

export default StrictDict({
  app,
  assignmentTypes,
  cohorts,
  filters,
  grades,
  roles,
  tracks,
  root,
});
