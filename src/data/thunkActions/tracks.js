/* eslint-disable import/prefer-default-export */
import { StrictDict } from '@src/utils';

import lms from '@src/data/services/lms';
import actions from '@src/data/actions';

export const fetchTracks = () => (
  (dispatch) => {
    dispatch(actions.tracks.fetching.started());
    return lms.api.fetch.tracks()
      .then(({ data }) => {
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
