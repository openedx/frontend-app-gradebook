import actions from '../actions/assignmentTypes';

const initialState = {
  results: [],
  startedFetching: false,
  errorFetching: false,
};

const assignmentTypes = (state = initialState, { type, payload }) => {
  switch (type) {
    case actions.fetching.started.toString():
      return {
        ...state,
        startedFetching: true,
      };
    case actions.fetching.received.toString():
      return {
        ...state,
        results: payload,
        errorFetching: false,
        finishedFetching: true,
      };
    case actions.fetching.error.toString():
      return {
        ...state,
        finishedFetching: true,
        errorFetching: true,
      };
    case actions.gotGradesFrozen.toString():
      return {
        ...state,
        areGradesFrozen: payload,
        errorFetching: false,
        finishedFetching: true,
      };
    default:
      return state;
  }
};

export { initialState };
export default assignmentTypes;
