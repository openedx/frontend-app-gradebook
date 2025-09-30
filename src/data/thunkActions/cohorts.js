import { StrictDict } from '../../utils';
import actions from '../actions';
import lms from '../services/lms';

export const fetchCohorts = () =>
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
  ;

export default StrictDict({ fetchCohorts });
