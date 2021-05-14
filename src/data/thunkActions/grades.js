/* eslint-disable import/no-self-import */
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

import { StrictDict } from 'utils';
import grades from '../actions/grades';
import { sortAlphaAsc } from '../actions/utils';

import selectors from '../selectors';

import GRADE_OVERRIDE_HISTORY_ERROR_DEFAULT_MSG from '../constants/errors';

import LmsApiService from '../services/LmsApiService';
import * as module from './grades';

const {
  formatMaxAssignmentGrade,
  formatMinAssignmentGrade,
  formatMaxCourseGrade,
  formatMinCourseGrade,
  formatGradeOverrideForDisplay,
} = selectors.grades;

export const defaultAssignmentFilter = 'All';

export const fetchBulkUpgradeHistory = courseId => (
  // todo add loading effect
  dispatch => LmsApiService.fetchGradeBulkOperationHistory(courseId).then(
    (response) => { dispatch(grades.bulkHistory.received(response)); },
  ).catch(() => dispatch(grades.bulkHistory.error()))
);

export const fetchGrades = (
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

export const fetchGradeOverrideHistory = (subsectionId, userId) => (
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

export const fetchMatchingUserGrades = (
  courseId,
  searchText,
  cohort,
  track,
  assignmentType,
  showSuccess,
  options = {},
) => {
  const newOptions = { ...options, searchText, showSuccess };
  return module.fetchGrades(courseId, cohort, track, assignmentType, newOptions);
};

export const fetchPrevNextGrades = (endpoint, courseId, cohort, track, assignmentType) => (
  (dispatch) => {
    dispatch(grades.fetching.started());
    return getAuthenticatedHttpClient().get(endpoint)
      .then(({ data }) => data)
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
      })
      .catch(() => {
        dispatch(grades.fetching.error());
      });
  }
);

export const submitFileUploadFormData = (courseId, formData) => (
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

export const updateGrades = (courseId, updateData, searchText, cohort, track) => (
  (dispatch) => {
    dispatch(grades.update.request());
    return LmsApiService.updateGradebookData(courseId, updateData)
      .then(response => response.data)
      .then((data) => {
        dispatch(grades.update.success({ courseId, data }));
        dispatch(module.fetchMatchingUserGrades(
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

export const updateGradesIfAssignmentGradeFiltersSet = (
  courseId,
  cohort,
  track,
  assignmentType,
) => (dispatch, getState) => {
  const assignmentGradeMin = selectors.filters.assignmentGradeMin(getState());
  const assignmentGradeMax = selectors.filters.assignmentGradeMax(getState());
  const hasAssignmentGradeFiltersSet = assignmentGradeMax || assignmentGradeMin;
  if (hasAssignmentGradeFiltersSet) {
    dispatch(module.fetchGrades(
      courseId,
      cohort,
      track,
      assignmentType,
    ));
  }
};

export default StrictDict({
  fetchBulkUpgradeHistory,
  fetchGrades,
  fetchGradeOverrideHistory,
  fetchMatchingUserGrades,
  fetchPrevNextGrades,
  submitFileUploadFormData,
  updateGrades,
  updateGradesIfAssignmentGradeFiltersSet,
});
