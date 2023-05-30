import React from 'react';

import { Form } from '@edx/paragon';

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
    hintText,
  } = useAdjustedGradeInputData();
  return (
    <span>
      <Form.Control
        type="text"
        name="adjustedGradeValue"
        value={value}
        onChange={onChange}
      />
      {hintText}
    </span>
  );
};

AdjustedGradeInput.propTypes = {};

export default AdjustedGradeInput;
