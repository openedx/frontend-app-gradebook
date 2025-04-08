import { StrictDict } from '@src/utils';

import selectorHooks from './selectors';
import actionHooks from './actions';
import thunkActionHooks from './thunkActions';

export const selectors = selectorHooks;
export const actions = actionHooks;
export const thunkActions = thunkActionHooks;

export default StrictDict({
  selectors,
  actions,
  thunkActions,
});
