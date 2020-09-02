import {
  STARTED_FETCHING_ASSIGNMENT_TYPES,
  ERROR_FETCHING_ASSIGNMENT_TYPES,
  GOT_ASSIGNMENT_TYPES,
  GOT_ARE_GRADES_FROZEN,
} from '../constants/actionTypes/assignmentTypes';

const initialState = {
  results: [],
  startedFetching: false,
  errorFetching: false,
};

const assignmentTypes = (state = initialState, action) => {
  switch (action.type) {
    case GOT_ASSIGNMENT_TYPES:
      return {
        ...state,
        results: action.assignmentTypes,
        errorFetching: false,
        finishedFetching: true,
      };
    case STARTED_FETCHING_ASSIGNMENT_TYPES:
      return {
        ...state,
        startedFetching: true,
      };
    case ERROR_FETCHING_ASSIGNMENT_TYPES:
      return {
        ...state,
        finishedFetching: true,
        errorFetching: true,
      };
    case GOT_ARE_GRADES_FROZEN:
      return {
        ...state,
        areGradesFrozen: action.areGradesFrozen,
        errorFetching: false,
        finishedFetching: true,
      };
    default:
      return state;
  }
};

export default assignmentTypes;
