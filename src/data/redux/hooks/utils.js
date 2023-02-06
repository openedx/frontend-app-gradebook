import { useDispatch } from 'react-redux';

import { StrictDict } from 'utils';

export const actionHook = (action) => () => (...args) => {
  const dispatch = useDispatch();
  dispatch(action(...args));
};

export default StrictDict({
  actionHook,
});
