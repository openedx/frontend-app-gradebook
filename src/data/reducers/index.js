import { combineReducers } from 'redux';

import cohorts from './cohorts';
import grades from './grades';
import tracks from './tracks';
import assignmentTypes from './assignmentTypes';

const rootReducer = combineReducers({
  grades,
  cohorts,
  tracks,
  assignmentTypes,
});

export default rootReducer;
