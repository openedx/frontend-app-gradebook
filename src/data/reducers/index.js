import { combineReducers } from 'redux';

import cohorts from './cohorts';
import grades from './grades';
import tracks from './tracks';

const rootReducer = combineReducers({
  grades,
  cohorts,
  tracks,
});

export default rootReducer;
