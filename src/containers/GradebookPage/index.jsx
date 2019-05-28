import { connect } from 'react-redux';

import Gradebook from '../../components/Gradebook';
import {
  fetchGrades,
  fetchMatchingUserGrades,
  fetchPrevNextGrades,
  updateGrades,
  toggleGradeFormat,
  filterColumns,
  closeBanner,
} from '../../data/actions/grades';
import { fetchCohorts } from '../../data/actions/cohorts';
import { fetchTracks } from '../../data/actions/tracks';
import { fetchAssignmentTypes } from '../../data/actions/assignmentTypes';
import { getRoles } from '../../data/actions/roles';

function shouldShowSpinner(state) {
  if (state.roles.canUserViewGradebook === true) {
    return state.grades.showSpinner;
  } else if (state.roles.canUserViewGradebook === false) {
    return false;
  } // canUserViewGradebook === null
  return true;
}

const mapStateToProps = state => (
  {
    grades: state.grades.results,
    headings: state.grades.headings,
    tracks: state.tracks.results,
    cohorts: state.cohorts.results,
    selectedTrack: state.grades.selectedTrack,
    selectedCohort: state.grades.selectedCohort,
    selectedAssignmentType: state.grades.selectedAssignmentType,
    format: state.grades.gradeFormat,
    showSuccess: state.grades.showSuccess,
    prevPage: state.grades.prevPage,
    nextPage: state.grades.nextPage,
    assignmentTypes: state.assignmentTypes.results,
    areGradesFrozen: state.assignmentTypes.areGradesFrozen,
    showSpinner: shouldShowSpinner(state),
    canUserViewGradebook: state.roles.canUserViewGradebook,
  }
);

const mapDispatchToProps = {
  getUserGrades: fetchGrades,
  searchForUser: fetchMatchingUserGrades,
  getPrevNextGrades: fetchPrevNextGrades,
  getCohorts: fetchCohorts,
  getTracks: fetchTracks,
  getAssignmentTypes: fetchAssignmentTypes,
  updateGrades,
  toggleFormat: toggleGradeFormat,
  filterColumns,
  closeBanner,
  getRoles,
};

const GradebookPage = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Gradebook);

export default GradebookPage;
