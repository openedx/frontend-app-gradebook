import { connect } from 'react-redux';

import Gradebook from '../../components/Gradebook';
import { fetchGrades, fetchMatchingUserGrades } from '../../data/actions/grades';

const mapStateToProps = state => (
  {
    grades: state.grades.results,
  }
);

const mapDispatchToProps = dispatch => (
  {
    getUserGrades: (courseId) => {
      dispatch(fetchGrades(courseId));
    },
    searchForUser: (courseId, searchText) => {
      dispatch(fetchMatchingUserGrades(courseId, searchText));
    },
  }
);

const GradebookPage = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Gradebook);

export default GradebookPage;
