import {
  STARTED_FETCHING_TRACKS,
  ERROR_FETCHING_TRACKS,
  GOT_TRACKS,
} from '../constants/actionTypes/tracks';

const initialState = {
  results: [],
  startedFetching: false,
  errorFetching: false,
};

const tracks = (state = initialState, action) => {
  switch (action.type) {
    case GOT_TRACKS:
      return {
        ...state,
        results: action.tracks,
        errorFetching: false,
        finishedFetching: true,
      };
    case STARTED_FETCHING_TRACKS:
      return {
        ...state,
        startedFetching: true,
      };
    case ERROR_FETCHING_TRACKS:
      return {
        ...state,
        finishedFetching: true,
        errorFetching: true,
      };
    default:
      return state;
  }
};

export default tracks;
