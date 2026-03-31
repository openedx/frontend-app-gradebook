import { StrictDict } from 'utils';

import lms from 'data/services/lms';
import * as filterConstants from 'data/constants/filters';

import * as module from '.';
import app from './app';
import assignmentTypes from './assignmentTypes';
import cohorts from './cohorts';
import filters from './filters';
import grades, { minGrade, maxGrade } from './grades';
import roles from './roles';
import tracks from './tracks';

const {
  filterConfig,
  filters: filterNames,
} = filterConstants;

/**
 * editModalPossibleGrade(state)
 * Returns the "possible" grade as shown in the edit modal.
 * @param {object} state - redux state;
 * @return {string} - possibleGrade to show on edit modal
 */
export const editModalPossibleGrade = (state) => (
  app.modalState.adjustedGradePossible(state) || grades.gradeOriginalPossibleGraded(state)
);

/**
 * filterBadgeConfig(state, name)
 * Takes a filter name and returns the appropriate badge config, with value and isDefault.
 * Determines if it should return a range or single-value config based on the presence of
 * a filterOrder prop in the filter config associated with the passed name.
 * @param {object} state - redux state
 * @param {string} name - api filter name
 */
export const filterBadgeConfig = (state, name) => {
  const filterValue = module.filterBadgeValues[name](state);
  const { filterOrder, ...config } = filterConfig[name];
  const isRange = !!filterOrder;
  const value = isRange ? `${filterValue[0]} - ${filterValue[1]}` : filterValue;
  const isDefault = (isRange
    ? (
      filters.isDefault(filterOrder[0], filterValue[0])
      && filters.isDefault(filterOrder[1], filterValue[1])
    )
    : filters.isDefault(name, filterValue)
  );
  return { ...config, value, isDefault };
};

/**
 * filterBadgeValues methods
 * For each filter type with an associated badge, provides a selector that returns the
 * content of that badge
 */
export const filterBadgeValues = StrictDict({
  [filterNames.assignment]: (state) => (
    filters.selectedAssignmentLabel(state) || ''
  ),
  [filterNames.assignmentType]: filters.assignmentType,
  [filterNames.includeCourseRoleMembers]: filters.includeCourseRoleMembers,
  [filterNames.cohort]: (state) => {
    const entry = module.selectedCohortEntry(state);
    return entry ? entry.name : '';
  },
  [filterNames.track]: (state) => {
    const entry = module.selectedTrackEntry(state);
    return entry ? entry.name : '';
  },
  [filterNames.assignmentGrade]: (state) => ([
    filters.assignmentGradeMin(state),
    filters.assignmentGradeMax(state),
  ]),
  [filterNames.courseGrade]: (state) => ([
    filters.courseGradeMin(state),
    filters.courseGradeMax(state),
  ]),
});

/**
 * formattedGradeLimits(state)
 * Returns an object of local grade limits, formatted for fetching.
 * This means only setting any of them if the assignment is set, and only setting an
 * individual min/max if they are not equal to the default min/max.
 * @param {object} state - redux state
 * @return {object} - { assignmentGradeMax, assignmentGradeMin, courseGradeMax, courseGradeMin }
 */
export const formattedGradeLimits = (state) => {
  const { assignmentGradeMax, assignmentGradeMin } = app.assignmentGradeLimits(state);
  const { courseGradeMax, courseGradeMin } = app.courseGradeLimits(state);
  const hasAssignment = filters.selectedAssignmentId(state) !== undefined;

  return {
    assignmentGradeMax: (assignmentGradeMax === maxGrade || !hasAssignment) ? null : assignmentGradeMax,
    assignmentGradeMin: (assignmentGradeMin === minGrade || !hasAssignment) ? null : assignmentGradeMin,
    courseGradeMax: courseGradeMax === maxGrade ? null : courseGradeMax,
    courseGradeMin: courseGradeMin === minGrade ? null : courseGradeMin,
  };
};

/**
 * getHeadings(state)
 * Returns the table headings given the current assignmentType and assignmentLabel filters.
 * @param {object} state - redux state
 * @return {string[]} - array of table headings
 */
export const getHeadings = (state) => grades.headingMapper(
  filters.assignmentType(state) || 'All',
  filters.selectedAssignmentLabel(state) || 'All',
  tracks.stateHasMastersTrack(state),
)(grades.getExampleSectionBreakdown(state));

/**
 * gradeExportUrl(state, options)
 * Returns the output of getGradeCsvUrl, applying the current includeCourseRoleMembers
 * filter.
 * @param {object} state - redux state
 * @return {string} - generated grade export url
 */
export const gradeExportUrl = (state) => (
  lms.urls.gradeCsvUrl(module.lmsApiServiceArgs(state))
);

/**
 * interventionExportUrl(state, options)
 * Returns the output of getInterventionExportUrl.
 * @param {object} state - redux state
 * @return {string} - generated intervention export url
 */
export const interventionExportUrl = (state) => (
  lms.urls.interventionExportCsvUrl(module.lmsApiServiceArgs(state))
);

/**
 * lmsApiServiceArgs(state)
 * Returns common lms api service request args.
 * @param {object} state - redux state
 * @return {object} lms api query params object
 */
export const lmsApiServiceArgs = (state) => ({
  cohort: cohorts.getCohortNameById(state, filters.cohort(state)),
  track: filters.track(state),
  assignment: filters.selectedAssignmentId(state),
  assignmentType: filters.assignmentType(state),
  assignmentGradeMin: grades.formatMinAssignmentGrade(
    filters.assignmentGradeMin(state),
    { assignmentId: filters.selectedAssignmentId(state) },
  ),
  assignmentGradeMax: grades.formatMaxAssignmentGrade(
    filters.assignmentGradeMax(state),
    { assignmentId: filters.selectedAssignmentId(state) },
  ),
  courseGradeMin: grades.formatMinCourseGrade(filters.courseGradeMin(state)),
  courseGradeMax: grades.formatMaxCourseGrade(filters.courseGradeMax(state)),
  excludedCourseRoles: filters.excludedCourseRoles(state),
});

/**
 * localFilters(state)
 * returns local filter data for fetchGrades call
 * @param {object} state - redux state
 * @return {object} - fetch arguments signifying current local filter state
 */
export const localFilters = (state) => {
  const id = filters.selectedAssignmentId(state);
  const searchText = app.searchValue(state);
  return {
    assignment: id,
    includeCourseRoleMembers: filters.includeCourseRoleMembers(state),
    ...module.formattedGradeLimits(state),
    ...(searchText !== '' && { searchText }),
  };
};

/**
 * selectedCohortEntry(state)
 * Returns the full entry data for the selected cohort
 * @param {object} state - redux state
 * @return {object} - selected cohort entry object
 */
export const selectedCohortEntry = (state) => (
  cohorts.allCohorts(state).find(
    ({ id }) => id === parseInt(filters.cohort(state), 10),
  )
);

/**
 * selectedTrackEntry(state)
 * Returns the full entry data for the selected track
 * @param {object} state - redux state
 * @return {object} - selected track entry object
 */
export const selectedTrackEntry = (state) => (
  tracks.allTracks(state).find(
    ({ slug }) => slug === filters.track(state),
  )
);

/**
 * shouldShowSpinner(state)
 * Returns true iff the user can view the gradebook and grades.showSpinner is true.
 * @param {object} state - redux state
 * @return {bool} - should show spinner?
 */
export const shouldShowSpinner = (state) => (
  roles.canUserViewGradebook(state)
  && grades.showSpinner(state)
);

/**
 * showBulkManagement(state, options)
 * Returns true iff the course has bulk management enabled
 * @param {object} state - redux state
 * @return {bool} - should show bulk management controls?
 */
export const showBulkManagement = (state) => (state.config.bulkManagementAvailable);

export default StrictDict({
  root: StrictDict({
    editModalPossibleGrade,
    filterBadgeConfig,
    getHeadings,
    gradeExportUrl,
    interventionExportUrl,
    localFilters,
    selectedCohortEntry,
    selectedTrackEntry,
    shouldShowSpinner,
    showBulkManagement,
  }),
  app,
  assignmentTypes,
  cohorts,
  filters,
  grades,
  roles,
  tracks,
});
