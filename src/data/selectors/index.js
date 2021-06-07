/* eslint-disable import/no-named-as-default-member, import/no-self-import */
import { StrictDict } from 'utils';
import LmsApiService from 'data/services/LmsApiService';

import * as module from '.';
import app from './app';
import assignmentTypes from './assignmentTypes';
import cohorts from './cohorts';
import filters from './filters';
import grades, { minGrade, maxGrade } from './grades';
import roles from './roles';
import special from './special';
import tracks from './tracks';

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
  if (!hasAssignment) {
    return {
      assignmentGradeMax: null,
      assignmentGradeMin: null,
      courseGradeMax: null,
      courseGradeMin: null,
    };
  }
  return {
    assignmentGradeMax: assignmentGradeMax === maxGrade ? null : assignmentGradeMax,
    assignmentGradeMin: assignmentGradeMin === minGrade ? null : assignmentGradeMin,
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
)(grades.getExampleSectionBreakdown(state));

/**
 * gradeExportUrl(state, options)
 * Returns the output of getGradeExportCsvUrl, applying the current includeCourseRoleMembers
 * filter.
 * @param {object} state - redux state
 * @return {string} - generated grade export url
 */
export const gradeExportUrl = (state) => (
  LmsApiService.getGradeExportCsvUrl(app.courseId(state), {
    ...module.lmsApiServiceArgs(state),
    excludeCourseRoles: filters.includeCourseRoleMembers(state) ? '' : 'all',
  })
);

/**
 * interventionExportUrl(state, options)
 * Returns the output of getInterventionExportUrl.
 * @param {object} state - redux state
 * @return {string} - generated intervention export url
 */
export const interventionExportUrl = (state) => (
  LmsApiService.getInterventionExportCsvUrl(
    app.courseId(state),
    module.lmsApiServiceArgs(state),
  )
);

/**
 * lmsApiServiceArgs(state)
 * Returns common lms api service request args.
 * @param {object} state - redux state
 * @return {object} lms api query params object
 */
export const lmsApiServiceArgs = (state) => ({
  cohort: cohorts.getCohortNameById(state, filters.cohort(state)),
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
 * Returns true iff the user has special access or bulk management is configured to be available
 * and the course has a masters track.
 * @param {object} state - redux state
 * @return {bool} - should show bulk management controls?
 */
export const showBulkManagement = (state) => (
  special.hasSpecialBulkManagementAccess(app.courseId(state))
  || (tracks.stateHasMastersTrack(state) && state.config.bulkManagementAvailable)
);

export default StrictDict({
  root: StrictDict({
    editModalPossibleGrade,
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
  special,
  tracks,
});
