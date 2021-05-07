const compose = (...fns) => {
  const [firstFunc, ...rest] = fns.reverse();
  return (...args) => rest.reduce((accum, fn) => fn(accum), firstFunc(...args));
};

const allTracks = state => state.tracks.results || [];
const trackIsMasters = track => track.slug === 'masters';
const hasMastersTrack = tracks => tracks.some(trackIsMasters);
const stateHasMastersTrack = compose(hasMastersTrack, allTracks);

const selectors = {
  allTracks,
  hasMastersTrack,
  stateHasMastersTrack,
  trackIsMasters,
};

export default selectors;
