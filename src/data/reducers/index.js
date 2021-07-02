import { combineReducers } from 'redux';

import app from './app';
import assignmentTypes from './assignmentTypes';
import cohorts from './cohorts';
import config from './config';
import filters from './filters';
import grades from './grades';
import roles from './roles';
import tracks from './tracks';

/* istanbul ignore next */
const rootReducer = combineReducers({
  app,
  assignmentTypes,
  cohorts,
  config,
  filters,
  grades,
  roles,
  tracks,
});

export default rootReducer;
