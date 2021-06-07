/* eslint-disable import/no-self-import */
import { StrictDict } from 'utils';
import * as module from './tracks';

export const mastersKey = 'masters';

/**
 * hasMastersTrack(tracks)
 * returns true if at least one track in the list is masters track
 * @param {object[]} tracks - list of track objects
 * @return {bool} - are any of the tracks a masters track?
 */
export const hasMastersTrack = tracks => tracks.some(({ slug }) => slug === mastersKey);

// Selectors
/**
 * allTracks(state)
 * returns all tracks resuls from top-level redux state
 * @param {object} state - redux state
 * @return {object[]} - list of track result entries
 */
export const allTracks = state => state.tracks.results || [];

/**
 * stateHasMastersTrack(state)
 * returns true if the state has a masters track entry.
 * @param {object} state - redux state
 * @return {bool} - does the state have a masters track entry?
 */
export const stateHasMastersTrack = (state) => module.hasMastersTrack(module.allTracks(state));

/**
 * tracksByName(state)
 * returns an object of all tracks keyed by name
 * @param {object} state - redux state
 * @return {object} - all tracks, keyed by name
 */
export const tracksByName = (state) => module.allTracks(state).reduce(
  (obj, track) => ({ ...obj, [track.name]: track }),
  {},
);

export default StrictDict({
  allTracks,
  hasMastersTrack,
  stateHasMastersTrack,
  tracksByName,
});
