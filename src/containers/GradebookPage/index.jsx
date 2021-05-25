import { connect } from 'react-redux';

import thunkActions from 'data/thunkActions';
import actions from 'data/actions';
import selectors from 'data/selectors';

import Gradebook from 'components/Gradebook';

const mapStateToProps = (state, ownProps) => {
  const {
    root,
    assignmentTypes,
    filters,
    grades,
    roles,
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
  downloadBulkGradesReport: actions.grades.downloadReport.bulkGrades,
  downloadInterventionReport: actions.grades.downloadReport.intervention,
  toggleFormat: actions.grades.toggleGradeFormat,

  filterAssignmentType: actions.filters.update.assignmentType,
  initializeFilters: actions.filters.initialize,
  resetFilters: actions.filters.reset,
  updateAssignmentFilter: actions.filters.update.assignment,
  updateAssignmentLimits: actions.filters.update.assignmentLimits,

  fetchGradeOverrideHistory: thunkActions.grades.fetchGradeOverrideHistory,
  getAssignmentTypes: thunkActions.assignmentTypes.fetchAssignmentTypes,
  getCohorts: thunkActions.cohorts.fetchCohorts,
  getPrevNextGrades: thunkActions.grades.fetchPrevNextGrades,
  getRoles: thunkActions.roles.fetchRoles,
  getTracks: thunkActions.tracks.fetchTracks,
  getUserGrades: thunkActions.grades.fetchGrades,
  submitFileUploadFormData: thunkActions.grades.submitFileUploadFormData,
};

const GradebookPage = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Gradebook);

export default GradebookPage;
