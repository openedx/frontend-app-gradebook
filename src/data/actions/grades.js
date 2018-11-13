import {
  STARTED_FETCHING_GRADES,
  FINISHED_FETCHING_GRADES,
  ERROR_FETCHING_GRADES,
  GOT_GRADES,
  GRADE_UPDATE_REQUEST,
  GRADE_UPDATE_SUCCESS,
  GRADE_UPDATE_FAILURE,
} from '../constants/actionTypes/grades';
import LmsApiService from '../services/LmsApiService';

const startedFetchingGrades = () => ({ type: STARTED_FETCHING_GRADES });
const finishedFetchingGrades = () => ({ type: FINISHED_FETCHING_GRADES });
const errorFetchingGrades = () => ({ type: ERROR_FETCHING_GRADES });
const gotGrades = grades => ({ type: GOT_GRADES, grades });

const gradeUpdateRequest = () => ({ type: GRADE_UPDATE_REQUEST });
const gradeUpdateSuccess = responseData => ({
  type: GRADE_UPDATE_SUCCESS,
  payload: { responseData },
})
const gradeUpdateFailure = error => ({
  type: GRADE_UPDATE_FAILURE,
  payload: { error },
});

const fetchGrades = courseId => (
  (dispatch) => {
    dispatch(startedFetchingGrades());
    return LmsApiService.fetchGradebookData(courseId)
      .then(response => response.data)
      .then((data) => {
        dispatch(gotGrades(data.results));
        dispatch(finishedFetchingGrades());
      })
      .catch((error) => {
        dispatch(errorFetchingGrades());
      });
  }
);

const fetchMatchingUserGrades = (courseId, searchText) => (
  (dispatch) => {
    dispatch(startedFetchingGrades());
    return LmsApiService.fetchGradebookData(courseId, searchText)
      .then(response => response.data)
      .then((data) => {
        dispatch(gotGrades(data.results));
        dispatch(finishedFetchingGrades());
      })
      .catch((error) => {
        dispatch(errorFetchingGrades());
      });
  }
);

const updateGrades = (courseId, updateData) => (
  (dispatch) => {
    dispatch(gradeUpdateRequest());
    return LmsApiService.updateGradebookData(courseId, updateData)
      .then(response => response.data)
      .then((data) => {
        dispatch(gradeUpdateSuccess(data))
      })
      .catch((error) => {
        dispatch(gradeUpdateFailure(error));
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
  gradeUpdateRequest,
  gradeUpdateSuccess,
  gradeUpdateFailure,
  updateGrades,
};
