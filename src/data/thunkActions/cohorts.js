/* eslint-disable import/prefer-default-export */
import { StrictDict } from 'utils';
import actions from 'data/actions';
import selectors from 'data/selectors';
import LmsApiService from 'data/services/LmsApiService';

export const fetchCohorts = () => (
  (dispatch, getState) => {
    dispatch(actions.cohorts.fetching.started());
    return LmsApiService.fetchCohorts(selectors.app.courseId(getState()))
      .then(response => response.data)
      .then((data) => {
        dispatch(actions.cohorts.fetching.received(data.cohorts));
      })
      .catch(() => {
        dispatch(actions.cohorts.fetching.error());
      });
  }
);

export default StrictDict({ fetchCohorts });
