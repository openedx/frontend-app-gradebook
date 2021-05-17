import actions from '../actions/cohorts';

const initialState = {
  results: [],
  startedFetching: false,
  errorFetching: false,
};

const cohorts = (state = initialState, action) => {
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
        finishedFetching: true,
        errorFetching: false,
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
export default cohorts;
