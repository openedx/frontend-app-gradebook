import { connect } from 'react-redux';

import Gradebook from '../../components/Gradebook';
import {
  fetchGrades,
  fetchMatchingUserGrades,
  fetchPrevNextGrades,
  updateGrades,
  toggleGradeFormat,
  filterColumns,
  updateBanner,
} from '../../data/actions/grades';
import { fetchCohorts } from '../../data/actions/cohorts';
import { fetchTracks } from '../../data/actions/tracks';
import { fetchAssignmentTypes } from '../../data/actions/assignmentTypes';

const mapStateToProps = state => (
  {
    grades: state.grades.results,
    headings: state.grades.headings,
    tracks: state.tracks.results,
    cohorts: state.cohorts.results,
    selectedTrack: state.grades.selectedTrack,
    selectedCohort: state.grades.selectedCohort,
    format: state.grades.gradeFormat,
    showSuccess: state.grades.showSuccess,
    prevPage: state.grades.prevPage,
    nextPage: state.grades.nextPage,
    assignmnetTypes: state.assignmentTypes.results,
    showSpinner: state.grades.showSpinner,
  }
);

const mapDispatchToProps = dispatch => (
  {
    getUserGrades: (courseId, cohort, track) => {
      dispatch(fetchGrades(courseId, cohort, track));
    },
    searchForUser: (courseId, searchText, cohort, track) => {
      dispatch(fetchMatchingUserGrades(courseId, searchText, cohort, track, false));
    },
    getPrevNextGrades: (endpoint, cohort, track) => {
      dispatch(fetchPrevNextGrades(endpoint, cohort, track));
    },
    getCohorts: (courseId) => {
      dispatch(fetchCohorts(courseId));
    },
    getTracks: (courseId) => {
      dispatch(fetchTracks(courseId));
    },
    getAssignmentTypes: (courseId) => {
      dispatch(fetchAssignmentTypes(courseId));
    },
    updateGrades: (courseId, updateData, searchText, cohort, track) => {
      dispatch(updateGrades(courseId, updateData, searchText, cohort, track));
    },
    toggleFormat: (formatType) => {
      dispatch(toggleGradeFormat(formatType));
    },
    filterColumns: (filterType, exampleUser) => {
      dispatch(filterColumns(filterType, exampleUser));
    },
    updateBanner: (showSuccess) => {
      dispatch(updateBanner(showSuccess));
    },
  }
);

const GradebookPage = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Gradebook);

export default GradebookPage;
