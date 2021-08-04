/* eslint-disable react/sort-comp, react/button-has-type */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { FormattedMessage } from '@edx/frontend-platform/i18n';

import selectors from 'data/selectors';
import actions from 'data/actions';
import thunkActions from 'data/thunkActions';

import messages from '../messages';
import SelectGroup from '../SelectGroup';

const { fetchGradesIfAssignmentGradeFiltersSet } = thunkActions.grades;

export class AssignmentFilter extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const assignment = event.target.value;
    const selectedFilterOption = this.props.assignmentFilterOptions.find(
      ({ label }) => label === assignment,
    );
    const { type, id } = selectedFilterOption || {};
    const typedValue = { label: assignment, type, id };
    this.props.updateAssignmentFilter(typedValue);
    this.props.updateQueryParams({ assignment: id });
    this.props.fetchGradesIfAssignmentGradeFiltersSet();
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
          label={<FormattedMessage {...messages.assignment} />}
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
};

AssignmentFilter.propTypes = {
  updateQueryParams: PropTypes.func.isRequired,
  // redux
  assignmentFilterOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    subsectionLabel: PropTypes.string,
    type: PropTypes.string,
    id: PropTypes.string,
  })),
  selectedAssignment: PropTypes.string,
  fetchGradesIfAssignmentGradeFiltersSet: PropTypes.func.isRequired,
  updateAssignmentFilter: PropTypes.func.isRequired,
};

export const mapStateToProps = (state) => {
  const { filters } = selectors;
  return {
    assignmentFilterOptions: filters.selectableAssignmentLabels(state),
    selectedAssignment: filters.selectedAssignmentLabel(state),
    selectedAssignmentType: filters.assignmentType(state),
    selectedCohort: filters.cohort(state),
    selectedTrack: filters.track(state),
  };
};

export const mapDispatchToProps = {
  updateAssignmentFilter: actions.filters.update.assignment,
  fetchGradesIfAssignmentGradeFiltersSet,
};

export default connect(mapStateToProps, mapDispatchToProps)(AssignmentFilter);
