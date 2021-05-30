/* eslint-disable import/no-named-as-default-member, import/no-self-import */
import { StrictDict } from 'utils';
import LmsApiService from 'data/services/LmsApiService';

import * as module from '.';
import app from './app';
import assignmentTypes from './assignmentTypes';
import cohorts from './cohorts';
import filters from './filters';
import grades from './grades';
import roles from './roles';
import special from './special';
import tracks from './tracks';

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
 * gradeExportUrl(state, options)
 * Returns the output of getGradeExportCsvUrl, applying the current includeCourseRoleMembers
 * filter.
 * @param {object} state - redux state
 * @param {object} options - options object of the form ({ courseId })
 * @return {string} - generated grade export url
 */
export const gradeExportUrl = (state, { courseId }) => (
  LmsApiService.getGradeExportCsvUrl(courseId, {
    ...module.lmsApiServiceArgs(state),
    excludeCourseRoles: filters.includeCourseRoleMembers(state) ? '' : 'all',
  })
);

/**
 * interventionExportUrl(state, options)
 * Returns the output of getInterventionExportUrl.
 * @param {object} state - redux state
 * @param {object} options - options object of the form ({ courseId })
 * @return {string} - generated intervention export url
 */
export const interventionExportUrl = (state, { courseId }) => (
  LmsApiService.getInterventionExportCsvUrl(
    courseId,
    module.lmsApiServiceArgs(state),
  )
);

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
 * showBulkManagement(state, options)
 * Returns true iff the user has special access or bulk management is configured to be available
 * and the course has a masters track.
 * @param {object} state - redux state
 * @param {object} options - options object of the form ({ courseId })
 * @return {bool} - should show bulk management controls?
 */
export const showBulkManagement = (state, { courseId }) => (
  special.hasSpecialBulkManagementAccess(courseId)
  || (tracks.stateHasMastersTrack(state) && state.config.bulkManagementAvailable)
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
    getHeadings,
    gradeExportUrl,
    interventionExportUrl,
    shouldShowSpinner,
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
