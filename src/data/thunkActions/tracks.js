/* eslint-disable import/prefer-default-export */
import { StrictDict } from 'utils';

import lms from 'data/services/lms';
import actions from 'data/actions';
import selectors from 'data/selectors';

import { fetchBulkUpgradeHistory } from './grades';

export const fetchTracks = () => (
  (dispatch) => {
    dispatch(actions.tracks.fetching.started());
    return lms.api.fetch.tracks()
      .then(response => response.data)
      .then((data) => {
        dispatch(actions.tracks.fetching.received(data.course_modes));
        if (selectors.tracks.hasMastersTrack(data.course_modes)) {
          dispatch(fetchBulkUpgradeHistory());
        }
      })
      .catch(() => {
        dispatch(actions.tracks.fetching.error());
      });
  }
);

export default StrictDict({
  fetchTracks,
});
