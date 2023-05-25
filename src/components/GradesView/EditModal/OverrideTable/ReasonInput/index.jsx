import React from 'react';

import { Form } from '@edx/paragon';

import useReasonInputData from './hooks';

export const controlTestId = 'reason-input-control';

/**
 * <ReasonInput />
 * Input control for the "reason for change" field in the Edit modal.
 */
export const ReasonInput = () => {
  const { ref, value, onChange } = useReasonInputData();
  return (
    <Form.Control
      type="text"
      name="reasonForChange"
      data-testid={controlTestId}
      {...{ value, onChange, ref }}
    />
  );
};

ReasonInput.propTypes = {};

export default ReasonInput;
