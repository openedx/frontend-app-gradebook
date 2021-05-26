import { connect } from 'react-redux';

import thunkActions from 'data/thunkActions';
import actions from 'data/actions';
import selectors from 'data/selectors';

import Gradebook from 'components/Gradebook';

const mapStateToProps = (state, ownProps) => {
  const {
    root,
    filters,
    grades,
  } = selectors;

  const { courseId } = ownProps.match.params;
  return {
    courseId,
    filteredUsersCount: grades.filteredUsersCount(state),
    gradeExportUrl: root.gradeExportUrl(state, { courseId }),
    interventionExportUrl: root.interventionExportUrl(state, { courseId }),
    selectedTrack: filters.track(state),
    selectedCohort: filters.cohort(state),
    selectedAssignmentType: filters.assignmentType(state),
    showBulkManagement: root.showBulkManagement(state, { courseId }),
    showSpinner: root.shouldShowSpinner(state),
    totalUsersCount: grades.totalUsersCount(state),
  };
};

const mapDispatchToProps = {
  toggleFormat: actions.grades.toggleGradeFormat,
  initializeFilters: actions.filters.initialize,
  resetFilters: actions.filters.reset,
  getRoles: thunkActions.roles.fetchRoles,
  getTracks: thunkActions.tracks.fetchTracks,
  getUserGrades: thunkActions.grades.fetchGrades,
};

const GradebookPage = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Gradebook);

export default GradebookPage;
