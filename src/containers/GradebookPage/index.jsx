import { connect } from 'react-redux';

import Gradebook from '../../components/Gradebook';
import { fetchComment } from '../../data/actions/comment';

const mapStateToProps = state => (
  {
  }
);

const mapDispatchToProps = dispatch => (
  {
  }
);

const GradebookPage = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Gradebook);

export default GradebookPage;
