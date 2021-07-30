/* eslint-disable react/sort-comp, react/button-has-type */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Button } from '@edx/paragon';

import selectors from 'data/selectors';
import thunkActions from 'data/thunkActions';

const { subsectionGrade } = selectors.grades;

/**
 * GradeButton
 * The button link for a user's grade for a given subseciton.
 * load formatting based on selected grade format, and on click, opens
 * the editModal, loading in the current entry and subsection.
 * @param {object} entry - user's grade entry
 * @param {object} subsection - user's subsection grade from subsection_breakdown
 */
export class GradeButton extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  get label() {
    return subsectionGrade[this.props.format](this.props.subsection);
  }

  onClick() {
    this.props.setModalState({
      userEntry: this.props.entry,
      subsection: this.props.subsection,
    });
  }

  render() {
    return this.props.areGradesFrozen
      ? this.label
      : (
        <Button
          variant="link"
          className="btn-header grade-button"
          onClick={this.onClick}
        >
          {this.label}
        </Button>
      );
  }
}

GradeButton.propTypes = {
  subsection: PropTypes.shape({
    attempted: PropTypes.bool,
    percent: PropTypes.number,
    score_possible: PropTypes.number,
    subsection_name: PropTypes.string,
    module_id: PropTypes.string,
  }).isRequired,
  entry: PropTypes.shape({
    user_id: PropTypes.number,
    username: PropTypes.string,
  }).isRequired,
  // redux
  areGradesFrozen: PropTypes.bool.isRequired,
  format: PropTypes.string.isRequired,
  setModalState: PropTypes.func.isRequired,
};

export const mapStateToProps = (state) => ({
  areGradesFrozen: selectors.assignmentTypes.areGradesFrozen(state),
  format: selectors.grades.gradeFormat(state),
});

export const mapDispatchToProps = {
  setModalState: thunkActions.app.setModalStateFromTable,
};

export default connect(mapStateToProps, mapDispatchToProps)(GradeButton);
