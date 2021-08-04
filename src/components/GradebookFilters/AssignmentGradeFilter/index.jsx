/* eslint-disable react/sort-comp, react/button-has-type */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { FormattedMessage } from '@edx/frontend-platform/i18n';
import { Button } from '@edx/paragon';

import selectors from 'data/selectors';
import actions from 'data/actions';
import thunkActions from 'data/thunkActions';

import messages from '../messages';
import PercentGroup from '../PercentGroup';

export class AssignmentGradeFilter extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSetMax = this.handleSetMax.bind(this);
    this.handleSetMin = this.handleSetMin.bind(this);
  }

  handleSubmit() {
    this.props.updateAssignmentLimits(this.props.localAssignmentLimits);
    this.props.fetchGrades();
    this.props.updateQueryParams(this.props.localAssignmentLimits);
  }

  handleSetMax({ target: { value } }) {
    this.props.setFilter({ assignmentGradeMax: value });
  }

  handleSetMin({ target: { value } }) {
    this.props.setFilter({ assignmentGradeMin: value });
  }

  render() {
    const {
      localAssignmentLimits: { assignmentGradeMax, assignmentGradeMin },
    } = this.props;
    return (
      <div className="grade-filter-inputs">
        <PercentGroup
          id="assignmentGradeMin"
          label={<FormattedMessage {...messages.minGrade} />}
          value={assignmentGradeMin}
          disabled={!this.props.selectedAssignment}
          onChange={this.handleSetMin}
        />
        <PercentGroup
          id="assignmentGradeMax"
          label={<FormattedMessage {...messages.maxGrade} />}
          value={assignmentGradeMax}
          disabled={!this.props.selectedAssignment}
          onChange={this.handleSetMax}
        />
        <div className="grade-filter-action">
          <Button
            type="submit"
            variant="outline-secondary"
            name="assignmentGradeMinMax"
            disabled={!this.props.selectedAssignment}
            onClick={this.handleSubmit}
          >
            Apply
          </Button>
        </div>
      </div>
    );
  }
}

AssignmentGradeFilter.defaultProps = {
  selectedAssignment: '',
};

AssignmentGradeFilter.propTypes = {
  updateQueryParams: PropTypes.func.isRequired,

  // redux
  fetchGrades: PropTypes.func.isRequired,
  localAssignmentLimits: PropTypes.shape({
    assignmentGradeMax: PropTypes.string,
    assignmentGradeMin: PropTypes.string,
  }).isRequired,
  selectedAssignment: PropTypes.string,
  setFilter: PropTypes.func.isRequired,
  updateAssignmentLimits: PropTypes.func.isRequired,
};

export const mapStateToProps = (state) => ({
  localAssignmentLimits: selectors.app.assignmentGradeLimits(state),
  selectedAssignment: selectors.filters.selectedAssignmentLabel(state),
});

export const mapDispatchToProps = {
  fetchGrades: thunkActions.grades.fetchGrades,
  setFilter: actions.app.setLocalFilter,
  updateAssignmentLimits: actions.filters.update.assignmentLimits,
};

export default connect(mapStateToProps, mapDispatchToProps)(AssignmentGradeFilter);
