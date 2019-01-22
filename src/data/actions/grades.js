import {
  STARTED_FETCHING_GRADES,
  FINISHED_FETCHING_GRADES,
  ERROR_FETCHING_GRADES,
  GOT_GRADES,
  GRADE_UPDATE_REQUEST,
  GRADE_UPDATE_SUCCESS,
  GRADE_UPDATE_FAILURE,
  TOGGLE_GRADE_FORMAT,
  SORT_GRADES,
  FILTER_COLUMNS,
  UPDATE_BANNER,
} from '../constants/actionTypes/grades';
import LmsApiService from '../services/LmsApiService';
import store from '../store';
import { headingMapper, gradeSortMap, sortAlphaAsc } from './utils';
import apiClient from '../apiClient';

const defaultAssignmentFilter = 'All';

const sortGrades = (columnName, direction) => {
  const sortFn = gradeSortMap(columnName, direction);
  const { results } = store.getState().grades;
  results.sort(sortFn);

  /* have to make a copy of results or React wont know there was
   * a change and wont trigger a re-render
   */
  return ({ type: SORT_GRADES, results: [...results] });
};

const startedFetchingGrades = () => ({ type: STARTED_FETCHING_GRADES });
const finishedFetchingGrades = () => ({ type: FINISHED_FETCHING_GRADES });
const errorFetchingGrades = () => ({ type: ERROR_FETCHING_GRADES });
const gotGrades = (grades, cohort, track, headings, prev, next, courseId) => ({
  type: GOT_GRADES,
  grades,
  cohort,
  track,
  headings,
  prev,
  next,
  courseId,
});

const gradeUpdateRequest = () => ({ type: GRADE_UPDATE_REQUEST });
const gradeUpdateSuccess = (courseId, responseData) => ({
  type: GRADE_UPDATE_SUCCESS,
  courseId,
  payload: { responseData },
});
const gradeUpdateFailure = (courseId, error) => ({
  type: GRADE_UPDATE_FAILURE,
  courseId,
  payload: { error },
});


const toggleGradeFormat = formatType => ({ type: TOGGLE_GRADE_FORMAT, formatType });

const filterColumns = (filterType, exampleUser) => (
  dispatch => dispatch({
    type: FILTER_COLUMNS,
    headings: headingMapper(filterType)(dispatch, exampleUser),
  })
);

const updateBanner = showSuccess => ({ type: UPDATE_BANNER, showSuccess });

const fetchGrades = (courseId, cohort, track, showSuccess) => (
  (dispatch) => {
    dispatch(startedFetchingGrades());
    return LmsApiService.fetchGradebookData(courseId, null, cohort, track)
      .then(response => response.data)
      .then((data) => {
        dispatch(gotGrades(
          data.results.sort(sortAlphaAsc),
          cohort,
          track,
          headingMapper(defaultAssignmentFilter)(dispatch, data.results[0]),
          data.previous,
          data.next,
          courseId,
        ));
        dispatch(finishedFetchingGrades());
        dispatch(updateBanner(!!showSuccess));
      })
      .catch(() => {
        dispatch(errorFetchingGrades());
      });
  }
);

const fetchMatchingUserGrades = (courseId, searchText, cohort, track, showSuccess) => (
  (dispatch) => {
    dispatch(startedFetchingGrades());
    return LmsApiService.fetchGradebookData(courseId, searchText, cohort, track)
      .then(response => response.data)
      .then((data) => {
        dispatch(gotGrades(
          data.results.sort(sortAlphaAsc),
          cohort,
          track,
          headingMapper(defaultAssignmentFilter)(dispatch, data.results[0]),
          data.previous,
          data.next,
          courseId,
        ));
        dispatch(finishedFetchingGrades());
        dispatch(updateBanner(showSuccess));
      })
      .catch(() => {
        dispatch(errorFetchingGrades());
      });
  }
);

const fetchPrevNextGrades = (endpoint, cohort, track, courseId) => (
  (dispatch) => {
    dispatch(startedFetchingGrades());
    return apiClient.get(endpoint)
      .then(response => response.data)
      .then((data) => {
        dispatch(gotGrades(
          data.results.sort(sortAlphaAsc),
          cohort,
          track,
          headingMapper(defaultAssignmentFilter)(dispatch, data.results[0]),
          data.previous,
          data.next,
          courseId,
        ));
        dispatch(finishedFetchingGrades());
      })
      .catch(() => {
        dispatch(errorFetchingGrades());
      });
  }
);


const updateGrades = (courseId, updateData, searchText, cohort, track) => (
  (dispatch) => {
    dispatch(gradeUpdateRequest());
    return LmsApiService.updateGradebookData(courseId, updateData)
      .then(response => response.data)
      .then((data) => {
        dispatch(gradeUpdateSuccess(courseId, data));
        dispatch(fetchMatchingUserGrades(courseId, searchText, cohort, track, true));
      })
      .catch((error) => {
        dispatch(gradeUpdateFailure(courseId, error));
      });
  }
);

export {
  startedFetchingGrades,
  finishedFetchingGrades,
  errorFetchingGrades,
  gotGrades,
  fetchGrades,
  fetchMatchingUserGrades,
  fetchPrevNextGrades,
  gradeUpdateRequest,
  gradeUpdateSuccess,
  gradeUpdateFailure,
  updateGrades,
  toggleGradeFormat,
  sortGrades,
  filterColumns,
  updateBanner,
};
