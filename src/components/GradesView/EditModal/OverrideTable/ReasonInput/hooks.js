import React from 'react';

import { useGradebookUi } from 'data/gradebookUiContext';

const useReasonInputData = () => {
  const ref = React.useRef();
  const { modalState, setModalState } = useGradebookUi();
  const { reasonForChange } = modalState;

  React.useEffect(() => {
    ref.current.focus();
  }, [ref]);

  const onChange = (event) => {
    setModalState({ reasonForChange: event.target.value });
  };

  return {
    value: reasonForChange,
    onChange,
    ref,
  };
};

export default useReasonInputData;
