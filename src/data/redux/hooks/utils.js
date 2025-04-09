import { StrictDict } from '@src/utils';
// useDispatch hook wouldn't work here because it is out of scope of the component
import store from '@src/data/store';

export const actionHook = (action) => () => (...args) => store.dispatch(action(...args));

export default StrictDict({
  actionHook,
});
