import { connect } from 'react-redux';

import Gradebook from '../../components/Gradebook';
import {
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
import { fetchAssignmentTypes } from '../../data/actions/assignmentTypes';
import { getRoles } from '../../data/actions/roles';
import LmsApiService from '../../data/services/LmsApiService';

import selectors from 'data/selectors';



function shouldShowSpinner(state) {
  if (state.roles.canUserViewGradebook === true) {
    return state.grades.showSpinner;
  } if (state.roles.canUserViewGradebook === false) {
    return false;
  } // canUserViewGradebook === null
  return true;
}

const mapStateToProps = (state, ownProps) => {
  const {
    root,
    assignmentTypes,
    cohorts,
    filters,
    grades,
    roles,
    tracks,
  } = selectors;

  const { courseId } = ownProps.match.params;
  return {
    courseId,
    areGradesFrozen: assignmentTypes.areGradesFrozen(state),
    assignmentTypes: assignmentTypes.allAssignmentTypes(state),
    assignmentFilterOptions: filters.selectableAssignmentLabels(state),
    bulkImportError: grades.bulkImportError(state),
    bulkManagementHistory: grades.bulkManagementHistoryEntries(state),
    canUserViewGradebook: roles.canUserViewGradebook(state),
    filteredUsersCount: grades.filteredUsersCount(state),
    format: grades.gradeFormat(state),
    gradeExportUrl: root.gradeExportUrl(state, { courseId }),
    grades: grades.allGrades(state),
    headings: root.getHeadings(state),
    interventionExportUrl: root.interventionExportUrl(state, { courseId }),
    nextPage: state.grades.nextPage,
    prevPage: state.grades.prevPage,
    selectedTrack: filters.track(state),
    selectedCohort: filters.cohort(state),
    selectedAssignmentType: filters.assignmentType(state),
    selectedAssignment: filters.selectedAssignmentLabel(state),
    showBulkManagement: root.showBulkManagement(state, { courseId }),
    showSpinner: root.shouldShowSpinner(state),
    totalUsersCount: grades.totalUsersCount(state),
    uploadSuccess: grades.uploadSuccess(state),
  };
};

const mapDispatchToProps = {
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
