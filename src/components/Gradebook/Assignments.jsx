/* eslint-disable react/sort-comp, react/button-has-type */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  Button,
  Collapsible,
  Form,
} from '@edx/paragon';

import { selectableAssignmentLabels } from '../../data/selectors/filters';
import * as gradesActions from '../../data/actions/grades';
import * as filterActions from '../../data/actions/filters';

export class Assignments extends React.Component {
  getAssignmentFilterOptions = () => [
    <option key="0" value="">All</option>,
    ...this.props.assignmentFilterOptions.map(({ label, subsectionLabel }) => (
      <option key={label} value={label}>{label}: {subsectionLabel}</option>
    )),
  ];

  handleAssignmentFilterChange = (event) => {
    const assignment = event.target.value;
    const {
      assignmentFilterOptions,
      courseId,
      selectedCohort,
      selectedTrack,
      selectedAssignmentType,
    } = this.props;
    const selectedFilterOption = assignmentFilterOptions.find(assig => assig.label === assignment);
    const { type, id } = selectedFilterOption || {};

    this.props.updateAssignmentFilter({ label: assignment, type, id });
    this.props.updateQueryParams({ assignment: id });
    this.props.updateGradesIfAssignmentGradeFiltersSet(courseId, selectedCohort, selectedTrack, selectedAssignmentType);
  };

  handleSubmitAssignmentGrade = (event) => {
    event.preventDefault();
    const {
      assignmentGradeMin,
      assignmentGradeMax,
    } = this.props;

    this.props.updateAssignmentLimits(assignmentGradeMin, assignmentGradeMax);
    this.props.getUserGrades(
      this.props.courseId,
      this.props.selectedCohort,
      this.props.selectedTrack,
      this.props.selectedAssignmentType,
    );
    this.props.updateQueryParams({ assignmentGradeMin, assignmentGradeMax });
  };

  assignmentTypeOptions = () => ([
    <option key="0" value="">All</option>,
    ...this.props.assignmentTypes.map(entry => <option key={entry} value={entry}>{entry}</option>),
  ]);

  updateAssignmentTypes = (e) => {
    const assignmentType = e.target.value;
    this.props.filterAssignmentType(assignmentType);
    this.props.updateQueryParams({ assignmentType });
  }

  render() {
    return (
      <Collapsible title="Assignments" defaultOpen className="filter-group mb-3">
        <div>
          <div className="student-filters">
            <Form.Group controlId="assignment-types">
              <Form.Label>Assignment Types</Form.Label>
              <Form.Control
                as="select"
                value={this.props.selectedAssignmentType}
                onChange={this.updateAssignmentTypes}
                disabled={this.props.assignmentFilterOptions.length === 0}
              >
                {this.assignmentTypeOptions()}
              </Form.Control>
            </Form.Group>
          </div>
          <div className="student-filters">
            <Form.Group controlId="assignment">
              <Form.Label>Assignment</Form.Label>
              <Form.Control
                as="select"
                value={this.props.selectedAssignment}
                onChange={this.handleAssignmentFilterChange}
                disabled={this.props.assignmentFilterOptions.length === 0}
              >
                {this.getAssignmentFilterOptions()}
              </Form.Control>
            </Form.Group>
          </div>
          <form className="grade-filter-inputs" onSubmit={this.handleSubmitAssignmentGrade}>
            <div className="percent-group">
              <Form.Group controlId="assignmentGradeMin">
                <Form.Label>Min Grade</Form.Label>
                <Form.Control
                  type="number"
                  min={0}
                  max={100}
                  step={1}
                  value={this.props.assignmentGradeMin}
                  disabled={!this.props.selectedAssignment}
                  onChange={(e) => this.props.setAssignmentGradeMin(e.target.value)}
                />
              </Form.Group>
              <span className="input-percent-label">%</span>
            </div>
            <div className="percent-group">
              <Form.Group controlId="assignmentGradeMax">
                <Form.Label>Max Grade</Form.Label>
                <Form.Control
                  type="number"
                  min={0}
                  max={100}
                  step={1}
                  value={this.props.assignmentGradeMax}
                  disabled={!this.props.selectedAssignment}
                  onChange={(e) => this.props.setAssignmentGradeMax(e.target.value)}
                />
              </Form.Group>
              <span className="input-percent-label">%</span>
            </div>
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
        </div>
      </Collapsible>
    );
  }
}

Assignments.defaultProps = {
  assignmentTypes: [],
  assignmentFilterOptions: [],
  selectedAssignment: '',
  selectedAssignmentType: '',
  selectedCohort: null,
  selectedTrack: null,
};

Assignments.propTypes = {
  assignmentGradeMin: PropTypes.string.isRequired,
  assignmentGradeMax: PropTypes.string.isRequired,
  courseId: PropTypes.string.isRequired,
  setAssignmentGradeMin: PropTypes.func.isRequired,
  setAssignmentGradeMax: PropTypes.func.isRequired,
  updateQueryParams: PropTypes.func.isRequired,

  // redux
  assignmentTypes: PropTypes.arrayOf(PropTypes.string),
  assignmentFilterOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    subsectionLabel: PropTypes.string,
  })),
  filterAssignmentType: PropTypes.func.isRequired,
  getUserGrades: PropTypes.func.isRequired,
  selectedAssignmentType: PropTypes.string,
  selectedAssignment: PropTypes.string,
  selectedCohort: PropTypes.string,
  selectedTrack: PropTypes.string,
  updateGradesIfAssignmentGradeFiltersSet: PropTypes.func.isRequired,
  updateAssignmentFilter: PropTypes.func.isRequired,
  updateAssignmentLimits: PropTypes.func.isRequired,
};

export const mapStateToProps = (state) => ({
  assignmentTypes: state.assignmentTypes.results,
  assignmentFilterOptions: selectableAssignmentLabels(state),
  selectedAssignment: (state.filters.assignment || {}).label,
  selectedAssignmentTypes: state.filters.assignmentType,
  selectedCohort: state.filters.cohort,
  selectedTrack: state.filters.track,
});

export const mapDispatchToProps = {
  getUserGrades: gradesActions.fetchGrades,
  filterAssignmentType: gradesActions.filterAssignmentType,
  updateAssignmentFilter: filterActions.updateAssignmentFilter,
  updateAssignmentLimits: filterActions.updateAssignmentLimits,
  updateGradesIfAssignmentGradeFiltersSet: gradesActions.updateGradesIfAssignmentGradeFilterSet,
};

export default connect(mapStateToProps, mapDispatchToProps)(Assignments);
