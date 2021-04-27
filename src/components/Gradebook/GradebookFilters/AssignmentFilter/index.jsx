/* eslint-disable react/sort-comp, react/button-has-type */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { selectableAssignmentLabels } from 'data/selectors/filters';
import * as gradesActions from 'data/actions/grades';
import * as filterActions from 'data/actions/filters';

import SelectGroup from '../SelectGroup';

export class AssignmentFilter extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const assignment = event.target.value;
    const selectedFilterOption = this.props.assignmentFilterOptions.find(assig => assig.label === assignment);
    const { type, id } = selectedFilterOption || {};
    const typedValue = { label: assignment, type, id };
    this.props.updateAssignmentFilter(typedValue);
    this.props.updateQueryParams({ assignment: id });
    this.props.updateGradesIfAssignmentGradeFiltersSet(
      this.props.courseId,
      this.props.selectedCohort,
      this.props.selectedTrack,
      this.props.selectedAssignmentType,
    );
  }

  get options() {
    const mapper = ({ label, subsectionLabel }) => (
      <option key={label} value={label}>
        {label}: {subsectionLabel}
      </option>
    );
    return ([
      <option key="0" value="">All</option>,
      ...this.props.assignmentFilterOptions.map(mapper),
    ]);
  }

  render() {
    return (
      <div className="student-filters">
        <SelectGroup
          id="assignment"
          label="Assignment"
          value={this.props.selectedAssignment}
          onChange={this.handleChange}
          disabled={this.props.assignmentFilterOptions.length === 0}
          options={this.options}
        />
      </div>
    );
  }
}

AssignmentFilter.defaultProps = {
  assignmentFilterOptions: [],
  selectedAssignment: '',
  selectedAssignmentType: '',
  selectedCohort: null,
  selectedTrack: null,
};

AssignmentFilter.propTypes = {
  courseId: PropTypes.string.isRequired,
  updateQueryParams: PropTypes.func.isRequired,

  // redux
  assignmentFilterOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    subsectionLabel: PropTypes.string,
    type: PropTypes.string,
    id: PropTypes.string,
  })),
  selectedAssignmentType: PropTypes.string,
  selectedAssignment: PropTypes.string,
  selectedCohort: PropTypes.string,
  selectedTrack: PropTypes.string,
  updateGradesIfAssignmentGradeFiltersSet: PropTypes.func.isRequired,
  updateAssignmentFilter: PropTypes.func.isRequired,
};

export const mapStateToProps = (state) => ({
  assignmentFilterOptions: selectableAssignmentLabels(state),
  selectedAssignment: (state.filters.assignment || {}).label,
  selectedAssignmentType: state.filters.assignmentType,
  selectedCohort: state.filters.cohort,
  selectedTrack: state.filters.track,
});

export const mapDispatchToProps = {
  updateAssignmentFilter: filterActions.updateAssignmentFilter,
  updateGradesIfAssignmentGradeFiltersSet: gradesActions.updateGradesIfAssignmentGradeFiltersSet,
};

export default connect(mapStateToProps, mapDispatchToProps)(AssignmentFilter);
