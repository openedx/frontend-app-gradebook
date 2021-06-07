import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { InputSelect } from '@edx/paragon';

import actions from 'data/actions';

const ScoreViewInput = ({ toggleFormat }) => (
  <InputSelect
    label="Score View:"
    name="ScoreView"
    value="percent"
    options={[{ label: 'Percent', value: 'percent' }, { label: 'Absolute', value: 'absolute' }]}
    onChange={toggleFormat}
  />
);
ScoreViewInput.propTypes = {
  toggleFormat: PropTypes.func.isRequired,
};

export const mapDispatchToProps = {
  toggleFormat: actions.grades.toggleGradeFormat,
};

export default connect(() => ({}), mapDispatchToProps)(ScoreViewInput);
