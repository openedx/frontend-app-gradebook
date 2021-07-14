/* eslint-disable react/sort-comp, react/button-has-type */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { FormattedMessage } from '@edx/frontend-platform/i18n';

import selectors from 'data/selectors';
import actions from 'data/actions';

import SelectGroup from '../SelectGroup';
import messages from '../messages';

export class AssignmentTypeFilter extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

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
      <div className="student-filters">
        <SelectGroup
          id="assignment-types"
          label={<FormattedMessage {...messages.assignmentTypes} />}
          value={this.props.selectedAssignmentType}
          onChange={this.handleChange}
          disabled={this.props.assignmentFilterOptions.length === 0}
          options={this.options}
        />
      </div>
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
  assignmentTypes: selectors.assignmentTypes.allAssignmentTypes(state),
  assignmentFilterOptions: selectors.filters.selectableAssignmentLabels(state),
  selectedAssignmentType: selectors.filters.assignmentType(state),
});

export const mapDispatchToProps = {
  filterAssignmentType: actions.filters.update.assignmentType,
};

export default connect(mapStateToProps, mapDispatchToProps)(AssignmentTypeFilter);
