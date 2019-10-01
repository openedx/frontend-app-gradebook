import { connect } from 'react-redux';

import Gradebook from '../../components/Gradebook';
import {
  closeBanner,
  fetchGradeOverrideHistory,
  fetchGrades,
  fetchMatchingUserGrades,
  fetchPrevNextGrades,
  filterAssignmentType,
  submitFileUploadFormData,
  toggleGradeFormat,
  updateGrades,
  updateGradesIfAssignmentGradeFiltersSet,
} from '../../data/actions/grades';
import { fetchCohorts } from '../../data/actions/cohorts';
import { fetchTracks } from '../../data/actions/tracks';
import { initializeFilters, updateAssignmentFilter, updateAssignmentLimits, updateCourseGradeFilter } from '../../data/actions/filters';
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
import { getCohortNameById } from '../../data/selectors/cohorts';
import { fetchAssignmentTypes } from '../../data/actions/assignmentTypes';
import { getRoles } from '../../data/actions/roles';
import LmsApiService from '../../data/services/LmsApiService';

function shouldShowSpinner(state) {
  if (state.roles.canUserViewGradebook === true) {
    return state.grades.showSpinner;
  } else if (state.roles.canUserViewGradebook === false) {
    return false;
  } // canUserViewGradebook === null
  return true;
}

const mapStateToProps = (state, ownProps) => (
  {
    courseId: ownProps.match.params.courseId,
    grades: state.grades.results,
    gradeOverrides: state.grades.gradeOverrideHistoryResults,
    gradeOverrideCurrentEarnedAllOverride: state.grades.gradeOverrideCurrentEarnedAllOverride,
    gradeOverrideCurrentPossibleAllOverride: state.grades.gradeOverrideCurrentPossibleAllOverride,
    gradeOverrideCurrentEarnedGradedOverride: state.grades.gradeOverrideCurrentEarnedGradedOverride,
    gradeOverrideCurrentPossibleGradedOverride:
      state.grades.gradeOverrideCurrentPossibleGradedOverride,
    gradeOriginalEarnedGraded: state.grades.gradeOriginalEarnedGraded,
    gradeOriginalPossibleGraded: state.grades.gradeOriginalPossibleGraded,
    headings: getHeadings(state),
    tracks: state.tracks.results,
    cohorts: state.cohorts.results,
    selectedTrack: state.filters.track,
    selectedCohort: state.filters.cohort,
    selectedAssignmentType: state.filters.assignmentType,
    selectedAssignment: (state.filters.assignment || {}).label,
    format: state.grades.gradeFormat,
    showSuccess: state.grades.showSuccess,
    errorFetchingGradeOverrideHistory: state.grades.errorFetchingOverrideHistory,
    prevPage: state.grades.prevPage,
    nextPage: state.grades.nextPage,
    assignmentTypes: state.assignmentTypes.results,
    assignmentFilterOptions: selectableAssignmentLabels(state),
    areGradesFrozen: state.assignmentTypes.areGradesFrozen,
    showSpinner: shouldShowSpinner(state),
    canUserViewGradebook: state.roles.canUserViewGradebook,
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
    }),
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
    bulkImportError: state.grades.bulkManagement &&
      state.grades.bulkManagement.errorMessages ?
      `Errors while processing: ${state.grades.bulkManagement.errorMessages.join(', ')}` :
      '',
    uploadSuccess: !!(state.grades.bulkManagement &&
                      state.grades.bulkManagement.uploadSuccess),
    showBulkManagement: stateHasMastersTrack(state) && state.config.bulkManagementAvailable,
    bulkManagementHistory: getBulkManagementHistory(state),
    totalUsersCount: state.grades.totalUsersCount,
    filteredUsersCount: state.grades.filteredUsersCount,
  }
);

const mapDispatchToProps = {
  getUserGrades: fetchGrades,
  fetchGradeOverrideHistory,
  searchForUser: fetchMatchingUserGrades,
  getPrevNextGrades: fetchPrevNextGrades,
  getCohorts: fetchCohorts,
  getTracks: fetchTracks,
  getAssignmentTypes: fetchAssignmentTypes,
  updateGrades,
  toggleFormat: toggleGradeFormat,
  filterAssignmentType,
  closeBanner,
  getRoles,
  submitFileUploadFormData,
  initializeFilters,
  updateAssignmentFilter,
  updateAssignmentLimits,
  updateGradesIfAssignmentGradeFiltersSet,
  updateCourseGradeFilter,
};

const GradebookPage = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Gradebook);

export default GradebookPage;
