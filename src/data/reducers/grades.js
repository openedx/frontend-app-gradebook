import {
  STARTED_FETCHING_GRADES,
  ERROR_FETCHING_GRADES,
  GOT_GRADES,
  TOGGLE_GRADE_FORMAT,
  FILTER_COLUMNS,
  OPEN_BANNER,
  CLOSE_BANNER,
  START_UPLOAD,
  UPLOAD_COMPLETE,
  UPLOAD_ERR,
  GOT_BULK_HISTORY,
  GOT_GRADE_OVERRIDE_HISTORY,
  ERROR_FETCHING_GRADE_OVERRIDE_HISTORY,
} from '../constants/actionTypes/grades';

const initialState = {
  results: [],
  gradeOverrideHistoryResults: [],
  gradeOverrideCurrentEarnedAllOverride: null,
  gradeOverrideCurrentPossibleAllOverride: null,
  gradeOverrideCurrentEarnedGradedOverride: null,
  gradeOverrideCurrentPossibleGradedOverride: null,
  gradeOriginalEarnedAll: null,
  gradeOriginalPossibleAll: null,
  gradeOriginalEarnedGraded: null,
  gradeOriginalPossibleGraded: null,
  headings: [],
  startedFetching: false,
  finishedFetching: false,
  errorFetching: false,
  gradeFormat: 'percent',
  showSuccess: false,
  prevPage: null,
  nextPage: null,
  showSpinner: true,
  bulkManagement: {},
  totalUsersCount: null,
  filteredUsersCount: null,
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
        totalUsersCount: action.totalUsersCount,
        filteredUsersCount: action.filteredUsersCount,
      };
    case GOT_GRADE_OVERRIDE_HISTORY:
      return {
        ...state,
        gradeOverrideHistoryResults: action.overrideHistory,
        gradeOverrideCurrentEarnedAllOverride: action.currentEarnedAllOverride,
        gradeOverrideCurrentPossibleAllOverride: action.currentPossibleAllOverride,
        gradeOverrideCurrentEarnedGradedOverride: action.currentEarnedGradedOverride,
        gradeOverrideCurrentPossibleGradedOverride: action.currentPossibleGradedOverride,
        gradeOriginalEarnedAll: action.originalGradeEarnedAll,
        gradeOriginalPossibleAll: action.originalGradePossibleAll,
        gradeOriginalEarnedGraded: action.originalGradeEarnedGraded,
        gradeOriginalPossibleGraded: action.originalGradePossibleGraded,
        errorFetchingOverrideHistory: false,
      };

    case ERROR_FETCHING_GRADE_OVERRIDE_HISTORY:
      return {
        ...state,
        finishedFetchingOverrideHistory: true,
        errorFetchingOverrideHistory: true,
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
    case START_UPLOAD: {
      const { errorMessages, uploadSuccess, ...rest } = state.bulkManagement;
      return {
        ...state,
        showSpinner: true,
        bulkManagement: rest,
      };
    }
    case UPLOAD_COMPLETE:
      return {
        ...state,
        showSpinner: false,
        bulkManagement: { uploadSuccess: true, ...state.bulkManagement },
      };
    case UPLOAD_ERR:
      return {
        ...state,
        showSpinner: false,
        bulkManagement: {
          ...state.bulkManagement,
          ...action.data,
        },
      };
    case GOT_BULK_HISTORY:
      return {
        ...state,
        bulkManagement: {
          ...state.bulkManagement,
          history: action.data,
        },
      };
    default:
      return state;
  }
};

export { initialState as initialGradesState };
export default grades;
