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
import { headingMapper } from './utils';

const startedFetchingGrades = () => ({ type: STARTED_FETCHING_GRADES });
const finishedFetchingGrades = () => ({ type: FINISHED_FETCHING_GRADES });
const errorFetchingGrades = () => ({ type: ERROR_FETCHING_GRADES });
const gotGrades = (grades, cohort, track, headings) => ({
  type: GOT_GRADES,
  grades,
  cohort,
  track,
  headings,
});

const gradeUpdateRequest = () => ({ type: GRADE_UPDATE_REQUEST });
const gradeUpdateSuccess = (responseData) => ({
  type: GRADE_UPDATE_SUCCESS,
  payload: { responseData },
});
const gradeUpdateFailure = error => ({
  type: GRADE_UPDATE_FAILURE,
  payload: { error },
});


const toggleGradeFormat = formatType => ({ type: TOGGLE_GRADE_FORMAT, formatType });
const sortGrades = (columnName, direction) => ({ type: SORT_GRADES, columnName, direction });

const filterColumns = (filterType, exampleUser) => ({ 
  type: FILTER_COLUMNS,
  headings: headingMapper[filterType](exampleUser) 
});

const updateBanner = (showSuccess) => ({ type: UPDATE_BANNER, showSuccess });

const fetchGrades = (courseId, cohort, track, showSuccess) => (
  (dispatch) => {
    dispatch(startedFetchingGrades());
    return LmsApiService.fetchGradebookData(courseId, null, cohort, track)
      .then(response => response.data)
      .then((data) => {
        dispatch(gotGrades(data.results, cohort, track, headingMapper.all(data.results[0])));
        dispatch(finishedFetchingGrades());
        dispatch(updateBanner(!!showSuccess));
      })
      .catch(() => {
        dispatch(errorFetchingGrades());
      });
  }
);

const fetchMatchingUserGrades = (courseId, searchText, cohort, track) => (
  (dispatch) => {
    dispatch(startedFetchingGrades());
    return LmsApiService.fetchGradebookData(courseId, searchText, cohort, track)
      .then(response => response.data)
      .then((data) => {
        dispatch(gotGrades(data.results, cohort, track));
        dispatch(finishedFetchingGrades());
      })
      .catch(() => {
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
        dispatch(fetchGrades(courseId, null, null, true))
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
  toggleGradeFormat,
  sortGrades,
  filterColumns,
  updateBanner,
};
