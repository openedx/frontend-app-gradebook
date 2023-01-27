import { useSelector } from 'react-redux';

import { StrictDict } from 'utils';
import selectors from 'data/selectors';

export const rootSelectors = {
  useGradeExportUrl: () => useSelector(selectors.root.gradeExportUrl),
  useSelectedCohortEntry: () => useSelector(selectors.root.selectedCohortEntry),
  useSelectedTrackEntry: () => useSelector(selectors.root.selectedTrackEntry),
};

export const app = StrictDict({
  useAssignmentGradeLimits: () => useSelector(selectors.app.assignmentGradeLimits),
  useAreCourseGradeFiltersValid: () => useSelector(selectors.app.areCourseGradeFiltersValid),
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
  useSelectableAssignmentLabels: () => useSelector(selectors.filters.selectableAssignmentLabels),
  useSelectedAssignmentLabel: () => useSelector(selectors.filters.selectedAssignmentLabel),
  useSelectedAssignmentType: () => useSelector(selectors.filters.selectedAssignmentType),
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
  ...rootSelectors,
});
