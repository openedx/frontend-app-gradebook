/* eslint-disable react/sort-comp, react/button-has-type */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Form } from '@edx/paragon';

import selectors from 'data/selectors';
import actions from 'data/actions';

/**
 * <AdjustedGradeInput />
 * Input control for adjusting the grade of a unit
 * displays an "/ ${possibleGrade} if there is one in the data model.
 */
export class AdjustedGradeInput extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange = ({ target }) => {
    this.props.setModalState({ adjustedGradeValue: target.value });
  };

  render() {
    return (
      <span>
        <Form.Control
          type="text"
          name="adjustedGradeValue"
          value={this.props.value}
          onChange={this.onChange}
        />
        {this.props.possibleGrade && ` / ${this.props.possibleGrade}`}
      </span>
    );
  }
}
AdjustedGradeInput.defaultProps = {
  possibleGrade: null,
};
AdjustedGradeInput.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  possibleGrade: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  setModalState: PropTypes.func.isRequired,
};

export const mapStateToProps = (state) => ({
  possibleGrade: selectors.root.editModalPossibleGrade(state),
  value: selectors.app.modalState.adjustedGradeValue(state),
});

export const mapDispatchToProps = {
  setModalState: actions.app.setModalState,
};

export default connect(mapStateToProps, mapDispatchToProps)(AdjustedGradeInput);
