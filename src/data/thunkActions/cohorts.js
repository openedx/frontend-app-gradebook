/* eslint-disable import/prefer-default-export */

import * as cohorts from '../actions/cohorts';

import LmsApiService from '../services/LmsApiService';

const fetchCohorts = courseId => (
  (dispatch) => {
    dispatch(cohorts.startedFetching());
    return LmsApiService.fetchCohorts(courseId)
      .then(response => response.data)
      .then((data) => {
        dispatch(cohorts.received(data.cohorts));
      })
      .catch(() => {
        dispatch(cohorts.errorFetching());
      });
  }
);

export { fetchCohorts };
