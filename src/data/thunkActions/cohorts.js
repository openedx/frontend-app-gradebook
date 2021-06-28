/* eslint-disable import/prefer-default-export */
import { StrictDict } from 'utils';
import actions from 'data/actions';
import lms from 'data/services/lms';

export const fetchCohorts = () => (
  (dispatch) => {
    dispatch(actions.cohorts.fetching.started());
    return lms.api.fetch.cohorts()
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
