import React from 'react';

import { Form } from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';
import messages from '../messages';

import useAdjustedGradeInputData from './hooks';

/**
 * <AdjustedGradeInput />
 * Input control for adjusting the grade of a unit
 * displays an "/ ${possibleGrade} if there is one in the data model.
 */
export const AdjustedGradeInput = () => {
  const {
    value,
    onChange,
    possibleGrade,
    hintText,
  } = useAdjustedGradeInputData();

  const { formatMessage } = useIntl();

  return (
    <span>
      <Form.Control
        type="number"
        name="adjustedGradeValue"
        value={value}
        onChange={onChange}
        size="sm"
      />
      {value > possibleGrade ? <div style={{ color: 'red' }}>{ formatMessage(messages.adjustedGradeError)}</div> : hintText}
    </span>
  );
};

AdjustedGradeInput.propTypes = {};

export default AdjustedGradeInput;
