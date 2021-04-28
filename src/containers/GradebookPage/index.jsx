import { connect } from 'react-redux';

import Gradebook from '../../components/Gradebook';
import {
  closeBanner,
  fetchGradeOverrideHistory,
  fetchGrades,
  fetchPrevNextGrades,
  filterAssignmentType,
  submitFileUploadFormData,
  toggleGradeFormat,
  downloadBulkGradesReport,
  downloadInterventionReport,
} from '../../data/actions/grades';
import { fetchCohorts } from '../../data/actions/cohorts';
import { fetchTracks } from '../../data/actions/tracks';
import {
  initializeFilters,
  resetFilters,
  updateAssignmentFilter,
  updateAssignmentLimits,
} from '../../data/actions/filters';
import stateHasMastersTrack from '../../data/selectors/tracks';
import {
  getBulkManagementHistory,
  getHeadings,
  formatMinAssignmentGrade,
  formatMaxAssignmentGrade,
  formatMinCourseGrade,
  formatMaxCourseGrade,
} from '../../data/selectors/grades';
import { selectableAssignmentLabels } from '../../data/selectors/filters';
import { hasSpecialBulkManagementAccess } from '../../data/selectors/special';
import { getCohortNameById } from '../../data/selectors/cohorts';
import { fetchAssignmentTypes } from '../../data/actions/assignmentTypes';
import { getRoles } from '../../data/actions/roles';
import LmsApiService from '../../data/services/LmsApiService';

function shouldShowSpinner(state) {
  if (state.roles.canUserViewGradebook === true) {
    return state.grades.showSpinner;
  } if (state.roles.canUserViewGradebook === false) {
    return false;
  } // canUserViewGradebook === null
  return true;
}

const mapStateToProps = (state, ownProps) => (
  {
    areGradesFrozen: state.assignmentTypes.areGradesFrozen,
    assignmentTypes: state.assignmentTypes.results,
    assignmentFilterOptions: selectableAssignmentLabels(state),
    bulkImportError: state.grades.bulkManagement
      && state.grades.bulkManagement.errorMessages
      ? `Errors while processing: ${state.grades.bulkManagement.errorMessages.join(', ')}`
      : '',
    bulkManagementHistory: getBulkManagementHistory(state),
    courseId: ownProps.match.params.courseId,
    canUserViewGradebook: state.roles.canUserViewGradebook,
    filteredUsersCount: state.grades.filteredUsersCount,
    format: state.grades.gradeFormat,
    gradeExportUrl: LmsApiService.getGradeExportCsvUrl(ownProps.match.params.courseId, {
      cohort: getCohortNameById(state, state.filters.cohort),
      track: state.filters.track,
      assignment: (state.filters.assignment || {}).id,
      assignmentType: state.filters.assignmentType,
      assignmentGradeMin: formatMinAssignmentGrade(
        state.filters.assignmentGradeMin,
        { assignmentId: (state.filters.assignment || {}).id },
      ),
      assignmentGradeMax: formatMaxAssignmentGrade(
        state.filters.assignmentGradeMax,
        { assignmentId: (state.filters.assignment || {}).id },
      ),
      courseGradeMin: formatMinCourseGrade(state.filters.courseGradeMin),
      courseGradeMax: formatMaxCourseGrade(state.filters.courseGradeMax),
      excludedCourseRoles: state.filters.includeCourseRoleMembers ? '' : 'all',
    }),
    grades: state.grades.results,
    headings: getHeadings(state),
    interventionExportUrl:
      LmsApiService.getInterventionExportCsvUrl(ownProps.match.params.courseId, {
        cohort: getCohortNameById(state, state.filters.cohort),
        assignment: (state.filters.assignment || {}).id,
        assignmentType: state.filters.assignmentType,
        assignmentGradeMin: formatMinAssignmentGrade(
          state.filters.assignmentGradeMin,
          { assignmentId: (state.filters.assignment || {}).id },
        ),
        assignmentGradeMax: formatMaxAssignmentGrade(
          state.filters.assignmentGradeMax,
          { assignmentId: (state.filters.assignment || {}).id },
        ),
        courseGradeMin: formatMinCourseGrade(state.filters.courseGradeMin),
        courseGradeMax: formatMaxCourseGrade(state.filters.courseGradeMax),
      }),
    nextPage: state.grades.nextPage,
    prevPage: state.grades.prevPage,
    selectedTrack: state.filters.track,
    selectedCohort: state.filters.cohort,
    selectedAssignmentType: state.filters.assignmentType,
    selectedAssignment: (state.filters.assignment || {}).label,
    showBulkManagement: (
      hasSpecialBulkManagementAccess(ownProps.match.params.courseId)
      || (stateHasMastersTrack(state) && state.config.bulkManagementAvailable)
    ),
    showSpinner: shouldShowSpinner(state),
    showSuccess: state.grades.showSuccess,
    totalUsersCount: state.grades.totalUsersCount,
    uploadSuccess: !!(state.grades.bulkManagement
                      && state.grades.bulkManagement.uploadSuccess),
  }
);

const mapDispatchToProps = {
  closeBanner,
  downloadBulkGradesReport,
  downloadInterventionReport,
  fetchGradeOverrideHistory,
  filterAssignmentType,
  getAssignmentTypes: fetchAssignmentTypes,
  getCohorts: fetchCohorts,
  getPrevNextGrades: fetchPrevNextGrades,
  getRoles,
  getTracks: fetchTracks,
  getUserGrades: fetchGrades,
  initializeFilters,
  resetFilters,
  submitFileUploadFormData,
  toggleFormat: toggleGradeFormat,
  updateAssignmentFilter,
  updateAssignmentLimits,
};

const GradebookPage = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Gradebook);

export default GradebookPage;
