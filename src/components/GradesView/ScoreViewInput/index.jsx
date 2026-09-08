import React from 'react';

import { Form } from '@openedx/paragon';
import { useIntl } from '@openedx/frontend-base';

import { useGradebookUi } from '@src/data/gradebookUiContext';
import { useGradeData } from '../data/hooks';
import messages from './messages';

/**
 * <ScoreViewInput />
 * Select control for grade format (percent vs absolute).
 */
export const ScoreViewInput = () => {
  const { formatMessage } = useIntl();
  const { gradeFormat } = useGradeData();
  const { setGradeFormat } = useGradebookUi();
  const toggleFormat = (e) => setGradeFormat(e.target.value);
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
