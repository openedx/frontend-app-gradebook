import { combineReducers } from 'redux';

import cohorts from './cohorts';
import grades from './grades';
import tracks from './tracks';
import assignmentTypes from './assignmentTypes';
import roles from './roles';
import filters from './filters';
import config from './config';

const rootReducer = combineReducers({
  grades,
  cohorts,
  tracks,
  assignmentTypes,
  roles,
  filters,
  config,
});

export default rootReducer;
