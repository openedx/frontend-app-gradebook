/* eslint-disable import/prefer-default-export */
import { StrictDict } from 'utils';

import lms from 'data/services/lms';
import actions from 'data/actions';

export const fetchTracks = () => (
  (dispatch) => {
    dispatch(actions.tracks.fetching.started());
    return lms.api.fetch.tracks()
      .then(response => response.data)
      .then((data) => {
        dispatch(actions.tracks.fetching.received(data.course_modes));
      })
      .catch(() => {
        dispatch(actions.tracks.fetching.error());
      });
  }
);

export default StrictDict({
  fetchTracks,
});
