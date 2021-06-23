import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { FormControl, FormGroup, FormLabel } from '@edx/paragon';

import actions from 'data/actions';
import selectors from 'data/selectors';

/**
 * <ScoreViewInput />
 * redux-connected select control for grade format (percent vs absolute)
 */
export const ScoreViewInput = ({ format, toggleFormat }) => (
  <FormGroup controlId="ScoreView">
    <FormLabel>Score View:</FormLabel>
    <FormControl
      as="select"
      value={format}
      onChange={toggleFormat}
    >
      <option value="percent">Percent</option>
      <option value="absolute">Absolute</option>
    </FormControl>
  </FormGroup>
);
ScoreViewInput.propTypes = {
  format: PropTypes.string.isRequired,
  toggleFormat: PropTypes.func.isRequired,
};

export const mapStateToProps = (state) => ({
  format: selectors.grades.gradeFormat(state),
});

export const mapDispatchToProps = {
  toggleFormat: actions.grades.toggleGradeFormat,
};

export default connect(() => ({}), mapDispatchToProps)(ScoreViewInput);
