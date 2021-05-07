/* eslint-disable import/prefer-default-export */
import * as tracks from '../actions/tracks';

import { hasMastersTrack } from '../selectors/tracks';

import {
  fetchBulkUpgradeHistory,
} from './grades';

import LmsApiService from '../services/LmsApiService';

const fetchTracks = courseId => (
  (dispatch) => {
    dispatch(tracks.fetching.started());
    return LmsApiService.fetchTracks(courseId)
      .then(response => response.data)
      .then((data) => {
        dispatch(tracks.fetching.received(data.course_modes));
        if (hasMastersTrack(data.course_modes)) {
          dispatch(fetchBulkUpgradeHistory(courseId));
        }
      })
      .catch(() => {
        dispatch(tracks.fetching.error());
      });
  }
);

export {
  fetchTracks,
};
