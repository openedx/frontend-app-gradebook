/* eslint-disable import/prefer-default-export */
import { StrictDict } from '@src/utils';
import actions from '@src/data/actions';
import lms from '@src/data/services/lms';

export const fetchCohorts = () => (
  (dispatch) => {
    dispatch(actions.cohorts.fetching.started());
    return lms.api.fetch.cohorts()
      .then(({ data }) => {
        dispatch(actions.cohorts.fetching.received(data));
      })
      .catch(() => {
        dispatch(actions.cohorts.fetching.error());
      });
  }
);

export default StrictDict({ fetchCohorts });
