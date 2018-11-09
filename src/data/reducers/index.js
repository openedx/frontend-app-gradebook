import { combineReducers } from 'redux';

import grades from './grades';

const rootReducer = combineReducers({
  grades,
});

export default rootReducer;
