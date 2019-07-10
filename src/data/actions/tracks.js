import {
  STARTED_FETCHING_TRACKS,
  GOT_TRACKS,
  ERROR_FETCHING_TRACKS,
} from '../constants/actionTypes/tracks';
import { hasMastersTrack } from '../selectors/tracks';
import { fetchBulkUpgradeHistory } from './grades';
import LmsApiService from '../services/LmsApiService';

const startedFetchingTracks = () => ({ type: STARTED_FETCHING_TRACKS });
const errorFetchingTracks = () => ({ type: ERROR_FETCHING_TRACKS });
const gotTracks = tracks => ({ type: GOT_TRACKS, tracks });

const fetchTracks = courseId => (
  (dispatch) => {
    dispatch(startedFetchingTracks());
    return LmsApiService.fetchTracks(courseId)
      .then(response => response.data)
      .then((data) => {
        dispatch(gotTracks(data.course_modes));
        if (hasMastersTrack(data.course_modes)) {
          dispatch(fetchBulkUpgradeHistory(courseId));
        }
      })
      .catch(() => {
        dispatch(errorFetchingTracks());
      });
  }
);

export {
  fetchTracks,
  startedFetchingTracks,
  gotTracks,
  errorFetchingTracks,
};
