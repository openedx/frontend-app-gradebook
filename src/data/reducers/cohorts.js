import {
  STARTED_FETCHING_COHORTS,
  ERROR_FETCHING_COHORTS,
  GOT_COHORTS,
} from '../constants/actionTypes/cohorts';

const initialState = {
  results: [],
  startedFetching: false,
  errorFetching: false,
};

const cohorts = (state = initialState, action) => {
  switch (action.type) {
    case GOT_COHORTS:
      return {
        ...state,
        results: action.cohorts,
        finishedFetching: true,
        errorFetching: false,
      };
    case STARTED_FETCHING_COHORTS:
      return {
        ...state,
        startedFetching: true,
      };
    case ERROR_FETCHING_COHORTS:
      return {
        ...state,
        finishedFetching: true,
        errorFetching: true,
      };
    default:
      return state;
  }
};

export default cohorts;
