import { combineReducers } from 'redux';

import cohorts from './cohorts';
import grades from './grades';
import tracks from './tracks';
import assignmentTypes from './assignmentTypes';
import roles from './roles';

const rootReducer = combineReducers({
  grades,
  cohorts,
  tracks,
  assignmentTypes,
  roles,
});

export default rootReducer;
