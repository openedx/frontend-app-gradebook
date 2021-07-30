import actions from '../actions/grades';
import filterActions from '../actions/filters';

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
  overrideHistoryError: '',
  gradeFormat: 'percent',
  showSuccess: false,
  prevPage: null,
  nextPage: null,
  showSpinner: true,
  bulkManagement: {},
  totalUsersCount: 0,
  filteredUsersCount: 0,
  isImportGradesActive: false,
  isDownloadInterventionsActive: false,
  isDownloadGradesActive: false,
};

const grades = (state = initialState, { type, payload }) => {
  switch (type) {
    case actions.banner.open.toString():
      return {
        ...state,
        showSuccess: true,
      };
    case actions.banner.close.toString():
      return {
        ...state,
        showSuccess: false,
      };
    case actions.bulkHistory.received.toString():
      return {
        ...state,
        bulkManagement: {
          ...state.bulkManagement,
          history: payload,
        },
      };
    case actions.csvUpload.started.toString(): {
      const { errorMessages, uploadSuccess, ...rest } = state.bulkManagement;
      return {
        ...state,
        showSpinner: true,
        bulkManagement: rest,
      };
    }
    case actions.csvUpload.finished.toString():
      return {
        ...state,
        showSpinner: false,
        bulkManagement: {
          ...state.bulkManagement,
          uploadSuccess: true,
        },
      };
    case actions.csvUpload.error.toString():
      return {
        ...state,
        showSpinner: false,
        bulkManagement: {
          ...state.bulkManagement,
          ...payload,
        },
      };
    case actions.doneViewingAssignment.toString(): {
      const {
        gradeOverrideHistoryResults,
        gradeOverrideCurrentEarnedAllOverride,
        gradeOverrideCurrentPossibleAllOverride,
        gradeOverrideCurrentEarnedGradedOverride,
        gradeOverrideCurrentPossibleGradedOverride,
        gradeOriginalEarnedAll,
        gradeOriginalPossibleAll,
        gradeOriginalEarnedGraded,
        gradeOriginalPossibleGraded,
        ...rest
      } = state;
      return rest;
    }
    case actions.fetching.started.toString():
      return {
        ...state,
        startedFetching: true,
        finishedFetching: false,
        showSpinner: true,
      };
    case actions.fetching.error.toString():
      return {
        ...state,
        finishedFetching: true,
        errorFetching: true,
      };
    case actions.fetching.received.toString():
      return {
        ...state,
        results: payload.grades,
        headings: payload.headings,
        finishedFetching: true,
        errorFetching: false,
        prevPage: payload.prev,
        nextPage: payload.next,
        showSpinner: false,
        courseId: payload.courseId,
        totalUsersCount: payload.totalUsersCount,
        filteredUsersCount: payload.filteredUsersCount,
      };
    case actions.overrideHistory.received.toString():
      return {
        ...state,
        gradeOverrideHistoryResults: payload.overrideHistory,
        gradeOverrideCurrentEarnedAllOverride: payload.currentEarnedAllOverride,
        gradeOverrideCurrentPossibleAllOverride: payload.currentPossibleAllOverride,
        gradeOverrideCurrentEarnedGradedOverride: payload.currentEarnedGradedOverride,
        gradeOverrideCurrentPossibleGradedOverride: payload.currentPossibleGradedOverride,
        gradeOriginalEarnedAll: payload.originalGradeEarnedAll,
        gradeOriginalPossibleAll: payload.originalGradePossibleAll,
        gradeOriginalEarnedGraded: payload.originalGradeEarnedGraded,
        gradeOriginalPossibleGraded: payload.originalGradePossibleGraded,
        overrideHistoryError: '',
      };
    case actions.overrideHistory.error.toString():
      return {
        ...state,
        finishedFetchingOverrideHistory: true,
        overrideHistoryError: payload,
      };
    case actions.toggleGradeFormat.toString():
      return {
        ...state,
        gradeFormat: payload.target.value,
      };
    case actions.update.request.toString():
      return { ...state, showSpinner: true };
    case actions.update.success.toString():
    case actions.update.failure.toString():
      return { ...state, showSpinner: false };

    case filterActions.update.assignmentType.toString():
      return {
        ...state,
        selectedAssignmentType: payload.filterType,
        headings: payload.headings,
      };
    default:
      return state;
  }
};

export { initialState as initialGradesState };
export default grades;
