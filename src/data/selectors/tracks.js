const compose = (...fns) => {
  const [firstFunc, ...rest] = fns.reverse();
  return (...args) => rest.reduce((accum, fn) => fn(accum), firstFunc(...args));
};

const getTracks = state => state.tracks.results || [];
const trackIsMasters = track => track.slug === 'masters';
const hasMastersTrack = tracks => tracks.some(trackIsMasters);
const stateHasMastersTrack = compose(hasMastersTrack, getTracks);

export { hasMastersTrack, trackIsMasters };
export default stateHasMastersTrack;
