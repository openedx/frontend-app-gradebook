/* eslint-disable import/prefer-default-export */

import cohorts from '../actions/cohorts';

import LmsApiService from '../services/LmsApiService';

const fetchCohorts = courseId => (
  (dispatch) => {
    dispatch(cohorts.fetching.started());
    return LmsApiService.fetchCohorts(courseId)
      .then(response => response.data)
      .then((data) => {
        dispatch(cohorts.fetching.received(data.cohorts));
      })
      .catch(() => {
        dispatch(cohorts.fetching.error());
      });
  }
);

export { fetchCohorts };
