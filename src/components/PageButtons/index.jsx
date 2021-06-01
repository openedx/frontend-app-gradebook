import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Button } from '@edx/paragon';

import selectors from 'data/selectors';
import thunkActions from 'data/thunkActions';

export class PageButtons extends React.Component {
  constructor(props) {
    super(props);
    this.getPrevGrades = this.getPrevGrades.bind(this);
    this.getNextGrades = this.getNextGrades.bind(this);
  }

  getPrevGrades() {
    this.props.getPrevNextGrades(
      this.props.prevPage,
      this.props.match.params.courseId,
      this.props.selectedCohort,
      this.props.selectedTrack,
      this.props.selectedAssignmentType,
    );
  }

  getNextGrades() {
    this.props.getPrevNextGrades(
      this.props.nextPage,
      this.props.match.params.courseId,
      this.props.selectedCohort,
      this.props.selectedTrack,
      this.props.selectedAssignmentType,
    );
  }

  render() {
    return (
      <div
        className="d-flex justify-content-center"
        style={{ paddingBottom: '20px' }}
      >
        <Button
          style={{ margin: '20px' }}
          variant="outline-primary"
          disabled={!this.props.prevPage}
          onClick={this.getPrevGrades}
        >
          Previous Page
        </Button>
        <Button
          style={{ margin: '20px' }}
          variant="outline-primary"
          disabled={!this.props.nextPage}
          onClick={this.getNextGrades}
        >
          Next Page
        </Button>
      </div>
    );
  }
}

PageButtons.defaultProps = {
  match: {
    params: { courseId: '' },
  },
  selectedAssignmentType: null,
  selectedCohort: null,
  selectedTrack: null,
  nextPage: '',
  prevPage: '',
};

PageButtons.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      courseId: PropTypes.string,
    }),
  }),
  selectedAssignmentType: PropTypes.string,
  selectedCohort: PropTypes.shape({ name: PropTypes.string }),
  selectedTrack: PropTypes.shape({ name: PropTypes.string }),
  // redux
  getPrevNextGrades: PropTypes.func.isRequired,
  nextPage: PropTypes.string,
  prevPage: PropTypes.string,
};

export const mapStateToProps = (state) => ({
  nextPage: selectors.grades.nextPage(state),
  prevPage: selectors.grades.prevPage(state),
});

export const mapDispatchToProps = {
  getPrevNextGrades: thunkActions.grades.fetchPrevNextGrades,
};

export default connect(mapStateToProps, mapDispatchToProps)(PageButtons);
