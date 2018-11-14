import {
  STARTED_FETCHING_GRADES,
  ERROR_FETCHING_GRADES,
  GOT_GRADES,
} from '../constants/actionTypes/grades';

const initialState = {
  results: [],
  startedFetching: false,
  finishedFetching: false,
  errorFetching: false,
};

const grades = (state = initialState, action) => {
  switch (action.type) {
    case GOT_GRADES:
      return {
        ...state,
        results: action.grades,
        finishedFetching: true,
        errorFetching: false,
        selectedTrack: action.track,
        selectedCohort: action.cohort,
      };
    case STARTED_FETCHING_GRADES:
      return {
        ...state,
        startedFetching: true,
        finishedFetching: false,
      };
    case ERROR_FETCHING_GRADES:
      return {
        ...state,
        finishedFetching: true,
        errorFetching: true,
      };
    default:
      return state;
  }
};

export default grades;
