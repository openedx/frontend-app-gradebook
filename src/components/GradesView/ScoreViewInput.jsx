import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { FormControl, FormGroup, FormLabel } from '@edx/paragon';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import actions from 'data/actions';
import selectors from 'data/selectors';
import messages from './ScoreViewInput.messages';

/**
 * <ScoreViewInput />
 * redux-connected select control for grade format (percent vs absolute)
 */
export const ScoreViewInput = ({ format, intl, toggleFormat }) => (
  <FormGroup controlId="ScoreView">
    <FormLabel><FormattedMessage {...messages.scoreView} />:</FormLabel>
    <FormControl
      as="select"
      value={format}
      onChange={toggleFormat}
    >
      <option value="percent">{intl.formatMessage(messages.percent)}</option>
      <option value="absolute">{intl.formatMessage(messages.absolute)}</option>
    </FormControl>
  </FormGroup>
);
ScoreViewInput.defaultProps = {
  format: 'percent',
};
ScoreViewInput.propTypes = {
  // injected
  intl: intlShape.isRequired,
  // redux
  format: PropTypes.string,
  toggleFormat: PropTypes.func.isRequired,
};

export const mapStateToProps = (state) => ({
  format: selectors.grades.gradeFormat(state),
});

export const mapDispatchToProps = {
  toggleFormat: actions.grades.toggleGradeFormat,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(ScoreViewInput));
