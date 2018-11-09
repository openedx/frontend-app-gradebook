import {
  STARTED_FETCHING_GRADES,
  FINISHED_FETCHING_GRADES,
  ERROR_FETCHING_GRADES,
  GOT_GRADES,
} from '../constants/actionTypes/grades';
import LmsApiService from '../services/LmsApiService';

const startedFetchingGrades = () => ({ type: STARTED_FETCHING_GRADES });
const finishedFetchingGrades = () => ({ type: FINISHED_FETCHING_GRADES });
const errorFetchingGrades = () => ({ type: ERROR_FETCHING_GRADES });
const gotGrades = grades => ({ type: GOT_GRADES, grades });

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
        dispatch(errorFetchingGrades())
      });
  }
);

export {
  startedFetchingGrades,
  finishedFetchingGrades,
  errorFetchingGrades,
  gotGrades,
  fetchGrades,
};
