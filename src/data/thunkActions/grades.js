import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

import grades from '../actions/grades';
import { sortAlphaAsc } from '../actions/utils';

import selectors from '../selectors';

import GRADE_OVERRIDE_HISTORY_ERROR_DEFAULT_MSG from '../constants/errors';

import LmsApiService from '../services/LmsApiService';

const {
  formatMaxAssignmentGrade,
  formatMinAssignmentGrade,
  formatMaxCourseGrade,
  formatMinCourseGrade,
  formatGradeOverrideForDisplay,
} = selectors.grades;

const defaultAssignmentFilter = 'All';

const fetchBulkUpgradeHistory = courseId => (
  // todo add loading effect
  dispatch => LmsApiService.fetchGradeBulkOperationHistory(courseId).then(
    (response) => { dispatch(grades.bulkHistory.received(response)); },
  ).catch(() => dispatch(grades.bulkHistory.error()))
);

const fetchGrades = (
  courseId,
  cohort,
  track,
  assignmentType,
  options = {},
) => (
  (dispatch, getState) => {
    dispatch(grades.fetching.started());
    const {
      assignment,
      assignmentGradeMax: assignmentMax,
      assignmentGradeMin: assignmentMin,
      courseGradeMin,
      courseGradeMax,
      includeCourseRoleMembers,
    } = selectors.filters.allFilters(getState());
    const { id: assignmentId } = assignment || {};
    const assignmentGradeMax = formatMaxAssignmentGrade(assignmentMax, { assignmentId });
    const assignmentGradeMin = formatMinAssignmentGrade(assignmentMin, { assignmentId });
    const courseGradeMinFormatted = formatMinCourseGrade(courseGradeMin);
    const courseGradeMaxFormatted = formatMaxCourseGrade(courseGradeMax);
    return LmsApiService.fetchGradebookData(
      courseId,
      options.searchText || null,
      cohort,
      track,
      {
        assignment: assignmentId,
        assignmentGradeMax,
        assignmentGradeMin,
        courseGradeMin: courseGradeMinFormatted,
        courseGradeMax: courseGradeMaxFormatted,
        includeCourseRoleMembers,
      },
    )
      .then(response => response.data)
      .then((data) => {
        dispatch(grades.received({
          grades: data.results.sort(sortAlphaAsc),
          cohort,
          track,
          assignmentType,
          prev: data.previous,
          next: data.next,
          courseId,
          totalUsersCount: data.total_users_count,
          filteredUsersCount: data.filtered_users_count,
        }));
        dispatch(grades.fetching.finished());
        if (options.showSuccess) {
          dispatch(grades.banner.open());
        }
      })
      .catch(() => {
        dispatch(grades.fetching.error());
      });
  }
);

const fetchGradeOverrideHistory = (subsectionId, userId) => (
  dispatch => LmsApiService.fetchGradeOverrideHistory(subsectionId, userId)
    .then(response => response.data)
    .then((data) => {
      if (data.success) {
        dispatch(grades.overrideHistory.received({
          overrideHistory: formatGradeOverrideForDisplay(data.history),
          currentEarnedAllOverride: data.override ? data.override.earned_all_override : null,
          currentPossibleAllOverride: data.override ? data.override.possible_all_override : null,
          currentEarnedGradedOverride: data.override ? data.override.earned_graded_override : null,
          currentPossibleGradedOverride: data.override
            ? data.override.possible_graded_override : null,
          originalGradeEarnedAll: data.original_grade ? data.original_grade.earned_all : null,
          originalGradePossibleAll: data.original_grade ? data.original_grade.possible_all : null,
          originalGradeEarnedGraded: data.original_grade
            ? data.original_grade.earned_graded : null,
          originalGradePossibleGraded: data.original_grade
            ? data.original_grade.possible_graded : null,
        }));
      } else {
        dispatch(grades.overrideHistory.errorFetching(data.error_message));
      }
    })
    .catch(() => {
      dispatch(grades.overrideHistory.errorFetching(GRADE_OVERRIDE_HISTORY_ERROR_DEFAULT_MSG));
    })
);

const fetchMatchingUserGrades = (
  courseId,
  searchText,
  cohort,
  track,
  assignmentType,
  showSuccess,
  options = {},
) => {
  const newOptions = { ...options, searchText, showSuccess };
  return fetchGrades(courseId, cohort, track, assignmentType, newOptions);
};

const fetchPrevNextGrades = (endpoint, courseId, cohort, track, assignmentType) => (
  (dispatch) => {
    dispatch(grades.fetching.started());
    return getAuthenticatedHttpClient().get(endpoint)
      .then(response => response.data)
      .then((data) => {
        dispatch(grades.fetching.results({
          grades: data.results.sort(sortAlphaAsc),
          cohort,
          track,
          assignmentType,
          prev: data.previous,
          next: data.next,
          courseId,
          totalUsersCount: data.total_users_count,
          filteredUsersCount: data.filtered_users_count,
        }));
        dispatch(grades.fetching.finished());
      })
      .catch(() => {
        dispatch(grades.fetching.error());
      });
  }
);

const submitFileUploadFormData = (courseId, formData) => (
  (dispatch) => {
    dispatch(grades.csvUpload.started());
    return LmsApiService.uploadGradeCsv(courseId, formData).then(() => {
      dispatch(grades.csvUpload.finished());
      dispatch(grades.uploadOverride.success(courseId));
    }).catch((err) => {
      dispatch(grades.uploadOverride.failure(courseId, err));
      if (err.status === 200 && err.data.error_messages.length) {
        const { error_messages: errorMessages, saved, total } = err.data;
        return dispatch(grades.csvUpload.error({ errorMessages, saved, total }));
      }
      return dispatch(grades.csvUpload.error({ errorMessages: ['Unknown error.'] }));
    });
  }
);

const updateGrades = (courseId, updateData, searchText, cohort, track) => (
  (dispatch) => {
    dispatch(grades.update.request());
    return LmsApiService.updateGradebookData(courseId, updateData)
      .then(response => response.data)
      .then((data) => {
        dispatch(grades.update.success({ courseId, data }));
        dispatch(fetchMatchingUserGrades(
          courseId,
          searchText,
          cohort,
          track,
          defaultAssignmentFilter,
          true,
          { searchText },
        ));
      })
      .catch((error) => {
        dispatch(grades.update.failure({ courseId, error }));
      });
  }
);

const updateGradesIfAssignmentGradeFiltersSet = (
  courseId,
  cohort,
  track,
  assignmentType,
) => (dispatch, getState) => {
  const { filters: { assignmentGradeMin, assignmentGradeMax } } = getState();
  const hasAssignmentGradeFiltersSet = assignmentGradeMax || assignmentGradeMin;
  if (hasAssignmentGradeFiltersSet) {
    dispatch(fetchGrades(
      courseId,
      cohort,
      track,
      assignmentType,
    ));
  }
};

export {
  fetchBulkUpgradeHistory,
  fetchGrades,
  fetchGradeOverrideHistory,
  fetchMatchingUserGrades,
  fetchPrevNextGrades,
  submitFileUploadFormData,
  updateGrades,
  updateGradesIfAssignmentGradeFiltersSet,
};
