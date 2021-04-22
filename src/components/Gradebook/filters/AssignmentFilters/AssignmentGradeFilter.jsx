/* eslint-disable react/sort-comp, react/button-has-type */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Button } from '@edx/paragon';

import * as gradesActions from 'data/actions/grades';
import * as filterActions from 'data/actions/filters';

import PercentGroup from './PercentGroup';

export class AssignmentGradeFilter extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSetMax = this.handleSetMax.bind(this);
    this.handleSetMin = this.handleSetMin.bind(this);
  };

  handleSubmit(event) {
    event.preventDefault();
    const {
      assignmentGradeMin,
      assignmentGradeMax,
    } = this.props;

    this.props.updateAssignmentLimits(
      assignmentGradeMin,
      assignmentGradeMax
    );
    this.props.getUserGrades(
      this.props.courseId,
      this.props.selectedCohort,
      this.props.selectedTrack,
      this.props.selectedAssignmentType,
    );
    this.props.updateQueryParams({
      assignmentGradeMin,
      assignmentGradeMax
    });
  }

  handleSetMax(event) {
    this.props.setAssignmentGradeMax(event.target.value);
  }

  handleSetMin(event) {
    this.props.setAssignmentGradeMin(event.target.value);
  }

  render() {
    return (
      <form
        className="grade-filter-inputs"
        onSubmit={this.handleSubmit}
      >
        <PercentGroup
          id="assignmentGradeMin"
          label="Min Grade"
          value={this.props.assignmentGradeMin}
          disabled={!this.props.selectedAssignment}
          onChange={this.handleSetMin}
        />
        <PercentGroup
          id="assignmentGradeMax"
          label="Max Grade"
          value={this.props.assignmentGradeMax}
          disabled={!this.props.selectedAssignment}
          onChange={this.handleSetMax}
        />
        <div className="grade-filter-action">
          <Button
            type="submit"
            variant="outline-secondary"
            name="assignmentGradeMinMax"
            disabled={!this.props.selectedAssignment}
          >
            Apply
          </Button>
        </div>
      </form>
    );
  }
}

AssignmentGradeFilter.defaultProps = {
  selectedAssignment: '',
  selectedAssignmentType: '',
  selectedCohort: null,
  selectedTrack: null,
};

AssignmentGradeFilter.propTypes = {
  assignmentGradeMin: PropTypes.string.isRequired,
  assignmentGradeMax: PropTypes.string.isRequired,
  courseId: PropTypes.string.isRequired,
  setAssignmentGradeMin: PropTypes.func.isRequired,
  setAssignmentGradeMax: PropTypes.func.isRequired,
  updateQueryParams: PropTypes.func.isRequired,

  // redux
  getUserGrades: PropTypes.func.isRequired,
  selectedAssignmentType: PropTypes.string,
  selectedAssignment: PropTypes.string,
  selectedCohort: PropTypes.string,
  selectedTrack: PropTypes.string,
  updateAssignmentLimits: PropTypes.func.isRequired,
};

export const mapStateToProps = (state) => ({
  selectedAssignment: (state.filters.assignment || {}).label,
  selectedAssignmentType: state.filters.assignmentType,
  selectedCohort: state.filters.cohort,
  selectedTrack: state.filters.track,
});

export const mapDispatchToProps = {
  getUserGrades: gradesActions.fetchGrades,
  updateAssignmentLimits: filterActions.updateAssignmentLimits,
};

export default connect(mapStateToProps, mapDispatchToProps)(AssignmentGradeFilter);
