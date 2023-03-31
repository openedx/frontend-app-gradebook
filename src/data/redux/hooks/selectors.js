import { useSelector } from 'react-redux';

import { StrictDict } from 'utils';
import selectors from 'data/selectors';

export const root = StrictDict({
  useGradeExportUrl: () => useSelector(selectors.root.gradeExportUrl),
  useSelectedCohortEntry: () => useSelector(selectors.root.selectedCohortEntry),
  useSelectedTrackEntry: () => useSelector(selectors.root.selectedTrackEntry),
  useShowBulkManagement: () => useSelector(selectors.root.showBulkManagement),
});

export const app = StrictDict({
  useActiveView: () => useSelector(selectors.app.activeView),
  useAssignmentGradeLimits: () => useSelector(selectors.app.assignmentGradeLimits),
  useAreCourseGradeFiltersValid: () => useSelector(selectors.app.areCourseGradeFiltersValid),
  useCourseGradeLimits: () => useSelector(selectors.app.courseGradeLimits),
  useCourseId: () => useSelector(selectors.app.courseId),
});

export const assignmentTypes = StrictDict({
  useAllAssignmentTypes: () => useSelector(selectors.assignmentTypes.allAssignmentTypes),
  useAreGradesFrozen: () => useSelector(selectors.assignmentTypes.areGradesFrozen),
});

export const cohorts = StrictDict({
  useAllCohorts: () => useSelector(selectors.cohorts.allCohorts),
  // maybe not needed?
  useCohortsByName: () => useSelector(selectors.cohorts.cohortsByName),
});

export const filters = StrictDict({
  useData: () => useSelector(selectors.filters.allFilters),
  useIncludeCourseRoleMembers: () => useSelector(selectors.filters.includeCourseRoleMembers),
  useSelectableAssignmentLabels: () => useSelector(selectors.filters.selectableAssignmentLabels),
  useSelectedAssignmentLabel: () => useSelector(selectors.filters.selectedAssignmentLabel),
  useAssignmentType: () => useSelector(selectors.filters.assignmentType),
});

export const roles = StrictDict({
  useCanUserViewGradebook: () => useSelector(selectors.roles.canUserViewGradebook),
});

export const tracks = StrictDict({
  useAllTracks: () => useSelector(selectors.tracks.allTracks),
  // maybe not needed?
  useTracksByName: () => useSelector(selectors.tracks.tracksByName),
});

export default StrictDict({
  app,
  assignmentTypes,
  cohorts,
  filters,
  roles,
  tracks,
  root,
});
