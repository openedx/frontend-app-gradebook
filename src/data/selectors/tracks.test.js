import selectors from './tracks';

const nonMastersTrack = {
  slug: 'honor',
  name: 'Honor Code Certificate',
  min_price: 0,
  suggested_prices: '',
  currency: 'usd',
  expiration_datetime: null,
  description: null,
  sku: null,
  bulk_sku: null,
};

const mastersTrack = {
  slug: 'masters',
  name: 'Masters track',
  min_price: 0,
  suggested_prices: 'a lot',
  currency: 'usd',
  expiration_datetime: null,
  description: null,
  sku: null,
  bulk_sku: null,
};

const exampleTracksWithoutMasters = [nonMastersTrack];
const exampleTracksWithMasters = [nonMastersTrack, mastersTrack];

describe('allTracks', () => {
  it('returns an empty array if no tracks found', () => {
    const allTracks = selectors.allTracks({ tracks: {} });
    expect(allTracks).toEqual([]);
  });

  it('returns tracks if included in result', () => {
    const allTracks = selectors.allTracks({ tracks: { results: exampleTracksWithoutMasters } });
    expect(allTracks).toEqual([
      {
        slug: 'honor',
        name: 'Honor Code Certificate',
        min_price: 0,
        suggested_prices: '',
        currency: 'usd',
        expiration_datetime: null,
        description: null,
        sku: null,
        bulk_sku: null,
      },
    ]);
  });
});

describe('hasMastersTrack', () => {
  it('returns true if a masters track is present', () => {
    const hasMastersTrack = selectors.hasMastersTrack(exampleTracksWithMasters);
    expect(hasMastersTrack).toBeTruthy();
  });

  it('returns false if a masters track is not present', () => {
    const hasMastersTrack = selectors.hasMastersTrack(exampleTracksWithoutMasters);
    expect(hasMastersTrack).toBeFalsy();
  });
});

describe('stateHasMastersTrack', () => {
  it('returns true if a masters track is present', () => {
    const stateHasMastersTrack = selectors.stateHasMastersTrack({ tracks: { results: exampleTracksWithMasters } });
    expect(stateHasMastersTrack).toBeTruthy();
  });

  it('returns false if a masters track is not present', () => {
    const stateHasMastersTrack = selectors.stateHasMastersTrack({ tracks: { results: exampleTracksWithoutMasters } });
    expect(stateHasMastersTrack).toBeFalsy();
  });
});

describe('trackIsMasters', () => {
  it('returns true if track is a masters track', () => {
    const trackIsMasters = selectors.trackIsMasters(mastersTrack);
    expect(trackIsMasters).toBeTruthy();
  });

  it('returns true if track is not a masters track', () => {
    const trackIsMasters = selectors.trackIsMasters(nonMastersTrack);
    expect(trackIsMasters).toBeFalsy();
  });
});
