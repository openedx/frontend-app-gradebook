import actions from '../actions/tracks';

const initialState = {
  results: [],
  startedFetching: false,
  errorFetching: false,
};

const tracks = (state = initialState, action) => {
  switch (action.type) {
    case actions.fetching.started.toString():
      return {
        ...state,
        startedFetching: true,
      };
    case actions.fetching.received.toString():
      return {
        ...state,
        results: action.payload,
        errorFetching: false,
        finishedFetching: true,
      };
    case actions.fetching.error.toString():
      return {
        ...state,
        finishedFetching: true,
        errorFetching: true,
      };
    default:
      return state;
  }
};

export { initialState };
export default tracks;
