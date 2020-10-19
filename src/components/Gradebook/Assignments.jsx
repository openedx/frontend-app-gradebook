/* eslint-disable react/sort-comp, react/button-has-type */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  Button,
  Collapsible,
  InputSelect,
  InputText,
} from '@edx/paragon';
import { selectableAssignmentLabels } from '../../data/selectors/filters';
import {
  filterAssignmentType,
  fetchGrades,
  updateGradesIfAssignmentGradeFiltersSet,
} from '../../data/actions/grades';
import {
  updateAssignmentFilter,
  updateAssignmentLimits,
} from '../../data/actions/filters';

export class Assignments extends React.Component {
  getAssignmentFilterOptions = () => [
    { label: 'All', value: '' },
    ...this.props.assignmentFilterOptions.map(({ label, subsectionLabel }) => ({
      label: `${label}: ${subsectionLabel}`,
      value: label,
    })),
  ];

  handleAssignmentFilterChange = (assignment) => {
    const selectedFilterOption = this.props.assignmentFilterOptions.find(assig => assig.label === assignment);
    const { type, id } = selectedFilterOption || {};
    const typedValue = { label: assignment, type, id };
    this.props.updateAssignmentFilter(typedValue);
    this.updateQueryParams({ assignment: id });
    this.props.updateGradesIfAssignmentGradeFiltersSet(
      this.props.courseId,
      this.props.selectedCohort,
      this.props.selectedTrack,
      this.props.selectedAssignmentType,
    );
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

  mapAssignmentTypeEntries = (entries) => {
    const mapped = [
      { id: 0, label: 'All', value: '' },
      ...entries.map(entry => ({ id: entry, label: entry })),
    ];
    return mapped;
  };

  updateAssignmentTypes = (assignmentType) => {
    this.props.filterAssignmentType(assignmentType);
    this.updateQueryParams({ assignmentType });
  }

  render() {
    return (
      <Collapsible title="Assignments" open className="filter-group mb-3">
        <div>
          <div className="student-filters">
            <span className="label">
              Assignment Types:
            </span>
            <InputSelect
              label="Assignment Types"
              name="assignment-types"
              aria-label="Assignment Types"
              value={this.props.selectedAssignmentType}
              options={this.mapAssignmentTypeEntries(this.props.assignmentTypes)}
              onChange={this.updateAssignmentTypes}
              disabled={this.props.assignmentFilterOptions.length === 0}
            />
          </div>
          <div className="student-filters">
            <span className="label">
              Assignment:
            </span>
            <InputSelect
              label="Assignment"
              name="assignment"
              aria-label="Assignment"
              value={this.props.selectedAssignment}
              options={this.getAssignmentFilterOptions()}
              onChange={this.handleAssignmentFilterChange}
              disabled={this.props.assignmentFilterOptions.length === 0}
            />
          </div>
          <p>Grade Range (0% - 100%)</p>
          <form className="d-fnlex justify-content-between align-items-center" onSubmit={this.handleSubmitAssignmentGrade}>
            <InputText
              label="Min Grade"
              name="assignmentGradeMin"
              type="number"
              min={0}
              max={100}
              step={1}
              value={this.props.assignmentGradeMin}
              disabled={!this.props.selectedAssignment}
              onChange={this.props.setAssignmentGradeMin}
            />
            <span className="input-percent-label">%</span>
            <InputText
              label="Max Grade"
              name="assignmentGradeMax"
              type="number"
              min={0}
              max={100}
              step={1}
              value={this.props.assignmentGradeMax}
              disabled={!this.props.selectedAssignment}
              onChange={this.props.setAssignmentGradeMax}
            />
            <span className="input-percent-label">%</span>
            <Button
              type="submit"
              className="btn-outline-secondary"
              name="assignmentGradeMinMax"
              disabled={!this.props.selectedAssignment}
            >
              Apply
            </Button>
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
  getUserGrades: fetchGrades,
  filterAssignmentType,
  updateAssignmentFilter,
  updateAssignmentLimits,
  updateGradesIfAssignmentGradeFiltersSet,
};

export default connect(mapStateToProps, mapDispatchToProps)(Assignments);
