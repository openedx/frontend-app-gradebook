/* eslint-disable react/sort-comp, react/button-has-type */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Form } from '@edx/paragon';

import selectors from 'data/selectors';
import actions from 'data/actions';
import { getLocale, isRtl } from '@edx/frontend-platform/i18n';

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
    let adjustedGradeValue;
    switch (true) {
      case target.value < 0:
        adjustedGradeValue = 0;
        break;
      case this.props.possibleGrade && target.value > this.props.possibleGrade:
        adjustedGradeValue = this.props.possibleGrade;
        break;
      default:
        adjustedGradeValue = target.value;
    }
    this.props.setModalState({ adjustedGradeValue });
  };

  render() {
    return (
      <span>
        <Form.Control
          type="number"
          name="adjustedGradeValue"
          min="0"
          max={this.props.possibleGrade ? this.props.possibleGrade : ''}
          value={this.props.value}
          onChange={this.onChange}
        />
        {this.props.possibleGrade && ` ${isRtl(getLocale()) ? '\\' : '/'} ${this.props.possibleGrade}`}
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
