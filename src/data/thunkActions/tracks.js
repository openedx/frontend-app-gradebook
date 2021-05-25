/* eslint-disable import/prefer-default-export */
import { StrictDict } from 'utils';
import tracks from '../actions/tracks';

import selectors from '../selectors';

import { fetchBulkUpgradeHistory } from './grades';

import LmsApiService from '../services/LmsApiService';

export const fetchTracks = courseId => (
  (dispatch) => {
    dispatch(tracks.fetching.started());
    return LmsApiService.fetchTracks(courseId)
      .then(response => response.data)
      .then((data) => {
        dispatch(tracks.fetching.received(data.course_modes));
        if (selectors.tracks.hasMastersTrack(data.course_modes)) {
          dispatch(fetchBulkUpgradeHistory(courseId));
        }
      })
      .catch(() => {
        dispatch(tracks.fetching.error());
      });
  }
);

export default StrictDict({
  fetchTracks,
});
