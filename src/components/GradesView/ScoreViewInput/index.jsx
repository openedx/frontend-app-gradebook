import React from 'react';

import { Form } from '@edx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';

import { actions, selectors } from 'data/redux/hooks';
import messages from './messages';

/**
 * <ScoreViewInput />
 * redux-connected select control for grade format (percent vs absolute)
 */
export const ScoreViewInput = () => {
  const { formatMessage } = useIntl();
  const { gradeFormat } = selectors.grades.useGradeData();
  const toggleFormat = actions.grades.useToggleGradeFormat();
  return (
    <Form.Group controlId="ScoreView">
      <Form.Label>{formatMessage(messages.scoreView)}:</Form.Label>
      <Form.Control
        as="select"
        value={gradeFormat}
        onChange={toggleFormat}
      >
        <option value="percent">{formatMessage(messages.percent)}</option>
        <option value="absolute">{formatMessage(messages.absolute)}</option>
      </Form.Control>
    </Form.Group>
  );
};
ScoreViewInput.propTypes = {};

export default ScoreViewInput;
