import {
  STARTED_FETCHING_GRADES,
  ERROR_FETCHING_GRADES,
  GOT_GRADES,
  TOGGLE_GRADE_FORMAT,
  FILTER_COLUMNS,
  UPDATE_BANNER,
  SORT_GRADES,
} from '../constants/actionTypes/grades';

const initialState = {
  results: [],
  headings: [],
  startedFetching: false,
  finishedFetching: false,
  errorFetching: false,
  gradeFormat: 'percent',
  showSuccess: false,
  prevPage: null,
  nextPage: null,
  showSpinner: true,
};

const grades = (state = initialState, action) => {
  switch (action.type) {
    case GOT_GRADES:
      return {
        ...state,
        results: action.grades,
        headings: action.headings,
        finishedFetching: true,
        errorFetching: false,
        selectedTrack: action.track,
        selectedCohort: action.cohort,
        prevPage: action.prev,
        nextPage: action.next,
        showSpinner: false,
      };
    case STARTED_FETCHING_GRADES:
      return {
        ...state,
        startedFetching: true,
        finishedFetching: false,
        showSpinner: true,
      };
    case ERROR_FETCHING_GRADES:
      return {
        ...state,
        finishedFetching: true,
        errorFetching: true,
      };
    case TOGGLE_GRADE_FORMAT:
      return {
        ...state,
        gradeFormat: action.formatType,
      };
    case FILTER_COLUMNS:
      return {
        ...state,
        headings: action.headings,
      };
    case UPDATE_BANNER:
      return {
        ...state,
        showSuccess: action.showSuccess,
      };
    case SORT_GRADES:
      return {
        ...state,
        results: action.results,
      };
    default:
      return state;
  }
};

export default grades;
