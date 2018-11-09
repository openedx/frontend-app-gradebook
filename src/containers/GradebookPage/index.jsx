import { connect } from 'react-redux';

import Gradebook from '../../components/Gradebook';
import { fetchGrades, fetchMatchingUserGrades, updateGrades } from '../../data/actions/grades';
import { fetchCohorts } from '../../data/actions/cohorts';
import { fetchTracks } from '../../data/actions/tracks';

const mapStateToProps = state => (
  {
    grades: state.grades.results,
    tracks: state.tracks.results,
    cohorts: state.cohorts.results,
    selectedTrack: state.grades.selectedTrack,
    selectedCohort: state.grades.selectedCohort,
  }
);

const mapDispatchToProps = dispatch => (
  {
    getUserGrades: (courseId, cohort, track) => {
      dispatch(fetchGrades(courseId, cohort, track));
    },
    searchForUser: (courseId, searchText, cohort, track) => {
      dispatch(fetchMatchingUserGrades(courseId, searchText, cohort, track));
    },
    getCohorts: (courseId) => {
      dispatch(fetchCohorts(courseId));
    },
    getTracks: (courseId) => {
      dispatch(fetchTracks(courseId));
    },
    updateGrades: (courseId, updateData) => {
      dispatch(updateGrades(courseId, updateData));
    },
  }
);

const GradebookPage = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Gradebook);

export default GradebookPage;
