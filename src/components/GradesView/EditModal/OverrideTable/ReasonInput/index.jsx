import { useEffect, useRef } from 'react';
import { Form } from '@openedx/paragon';

import { useGradebookUi } from '@src/data/gradebookUiContext';

export const controlTestId = 'reason-input-control';

/**
 * <ReasonInput />
 * Input control for the "reason for change" field in the Edit modal.
 */
export const ReasonInput = () => {
  const ref = useRef(null);
  const { modalState, setModalState } = useGradebookUi();
  const value = modalState.reasonForChange;

  useEffect(() => {
    ref.current?.focus();
  }, []);

  const onChange = (event) => {
    setModalState({ reasonForChange: event.target.value });
  };

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
