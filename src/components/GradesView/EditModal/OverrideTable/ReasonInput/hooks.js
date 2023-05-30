import React from 'react';

import { actions, selectors } from 'data/redux/hooks';

const useReasonInputData = () => {
  const ref = React.useRef();
  const { reasonForChange } = selectors.app.useModalData();
  const setModalState = actions.app.useSetModalState();

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
