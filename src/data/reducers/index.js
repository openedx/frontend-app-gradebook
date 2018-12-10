import { combineReducers } from 'redux';
import { userProfile } from '@edx/frontend-auth';

import cohorts from './cohorts';
import grades from './grades';
import tracks from './tracks';
import assignmentTypes from './assignmentTypes';

const identityReducer = (state) => {
  const newState = { ...state };
  return newState;
};

const rootReducer = combineReducers({
  // The authentication state is added as initialState when
  // creating the store in data/store.js.
  authentication: identityReducer,
  userProfile,
  grades,
  cohorts,
  tracks,
  assignmentTypes,
});

export default rootReducer;
