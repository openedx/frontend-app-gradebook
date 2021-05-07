import * as actions from '../actions/assignmentTypes';

const initialState = {
  results: [],
  startedFetching: false,
  errorFetching: false,
};

const assignmentTypes = (state = initialState, { type, payload }) => {
  switch (type) {
    case actions.received.toString():
      return {
        ...state,
        results: payload,
        errorFetching: false,
        finishedFetching: true,
      };
    case actions.startedFetching.toString():
      return {
        ...state,
        startedFetching: true,
      };
    case actions.errorFetching.toString():
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

export default assignmentTypes;
