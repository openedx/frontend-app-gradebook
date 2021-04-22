/* eslint-disable react/sort-comp, react/button-has-type */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { selectableAssignmentLabels } from 'data/selectors/filters';
import * as gradesActions from 'data/actions/grades';

import SelectGroup from './SelectGroup';

export class AssignmentTypeFilter extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  };

  handleChange(event) {
    const assignmentType = event.target.value;
    this.props.filterAssignmentType(assignmentType);
    this.props.updateQueryParams({ assignmentType });
  }

  get options() {
    const mapper = (entry) => (
      <option key={entry} value={entry}>{entry}</option>
    );
    return [
      <option key="0" value="">All</option>,
      ...this.props.assignmentTypes.map(mapper),
    ];
  }

  render() {
    return (
      <SelectGroup
        id="assignment-types"
        label="Assignment Types"
        value={this.props.selectedAssignmentType}
        onChange={this.handleChange}
        disabled={this.props.assignmentFilterOptions.length === 0}
        options={this.options}
      />
    );
  }
}

AssignmentTypeFilter.defaultProps = {
  assignmentTypes: [],
  assignmentFilterOptions: [],
  selectedAssignmentType: '',
};

AssignmentTypeFilter.propTypes = {
  updateQueryParams: PropTypes.func.isRequired,

  // redux
  assignmentTypes: PropTypes.arrayOf(PropTypes.string),
  assignmentFilterOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    subsectionLabel: PropTypes.string,
  })),
  filterAssignmentType: PropTypes.func.isRequired,
  selectedAssignmentType: PropTypes.string,
};

export const mapStateToProps = (state) => ({
  assignmentTypes: state.assignmentTypes.results,
  assignmentFilterOptions: selectableAssignmentLabels(state),
  selectedAssignmentType: state.filters.assignmentType,
});

export const mapDispatchToProps = {
  filterAssignmentType: gradesActions.filterAssignmentType,
};

export default connect(mapStateToProps, mapDispatchToProps)(AssignmentTypeFilter);
