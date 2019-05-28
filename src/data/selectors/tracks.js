const getTracks = state => state.tracks.results || [];
const hasMastersTrack = state => getTracks(state).some(track => track.slug === 'masters');

export default hasMastersTrack;
