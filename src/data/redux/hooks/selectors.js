import { useSelector } from 'react-redux';

import { StrictDict } from 'utils';
import selectors from 'data/selectors';

export const root = StrictDict({
  useGradeExportUrl: () => useSelector(selectors.root.gradeExportUrl),
  useSelectedCohortEntry: () => useSelector(selectors.root.selectedCohortEntry),
  useSelectedTrackEntry: () => useSelector(selectors.root.selectedTrackEntry),
});

export const app = StrictDict({
  useAssignmentGradeLimits: () => useSelector(selectors.app.assignmentGradeLimits),
  useAreCourseGradeFiltersValid: () => useSelector(selectors.app.areCourseGradeFiltersValid),
  useAreAssignmentGradeFiltersValid: () => useSelector(selectors.app.areAssignmentGradeFiltersValid),
  useCourseGradeLimits: () => useSelector(selectors.app.courseGradeLimits),
});

export const assignmentTypes = StrictDict({
  useAllAssignmentTypes: () => useSelector(selectors.assignmentTypes.allAssignmentTypes),
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
  tracks,
  root,
});
