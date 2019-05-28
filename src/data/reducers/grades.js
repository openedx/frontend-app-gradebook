import {
  STARTED_FETCHING_GRADES,
  ERROR_FETCHING_GRADES,
  GOT_GRADES,
  TOGGLE_GRADE_FORMAT,
  FILTER_COLUMNS,
  OPEN_BANNER,
  CLOSE_BANNER,
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
        selectedAssignmentType: action.assignmentType,
        prevPage: action.prev,
        nextPage: action.next,
        showSpinner: false,
        courseId: action.courseId,
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
    case OPEN_BANNER:
      return {
        ...state,
        showSuccess: true,
      };
    case CLOSE_BANNER:
      return {
        ...state,
        showSuccess: false,
      };
    default:
      return state;
  }
};

export default grades;
