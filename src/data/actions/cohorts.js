import {
  STARTED_FETCHING_COHORTS,
  GOT_COHORTS,
  ERROR_FETCHING_COHORTS,
} from '../constants/actionTypes/cohorts';
import LmsApiService from '../services/LmsApiService';

const startedFetchingCohorts = () => ({ type: STARTED_FETCHING_COHORTS });
const errorFetchingCohorts = () => ({ type: ERROR_FETCHING_COHORTS });
const gotCohorts = cohorts => ({ type: GOT_COHORTS, cohorts });

const fetchCohorts = courseId => (
  (dispatch) => {
    dispatch(startedFetchingCohorts());
    return LmsApiService.fetchCohorts(courseId)
      .then(response => response.data)
      .then((data) => {
        dispatch(gotCohorts(data.cohorts));
      })
      .catch(() => {
        dispatch(errorFetchingCohorts());
      });
  }
);

export {
  fetchCohorts,
  startedFetchingCohorts,
  gotCohorts,
  errorFetchingCohorts,
};
