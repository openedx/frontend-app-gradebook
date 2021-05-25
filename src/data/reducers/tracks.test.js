import tracks, { initialState } from './tracks';
import actions from '../actions/tracks';

const tracksData = [
  { someArbitraryField: 'arbitrary data' },
  { anotherArbitraryField: 'more arbitrary data' },
];

const testingState = {
  ...initialState,
  results: tracksData,
  arbitraryField: 'arbitrary',
};

describe('tracks reducer', () => {
  it('has initial state', () => {
    expect(
      tracks(undefined, {}),
    ).toEqual(initialState);
  });

  describe('handling actions.fetching.started', () => {
    it('set start fetching to true. Preserve results if existed', () => {
      expect(
        tracks(testingState, actions.fetching.started()),
      ).toEqual({
        ...testingState,
        startedFetching: true,
      });
    });
  });

  describe('handling actions.fetching.received', () => {
    it('replace results then set finish fetching to true and error to false', () => {
      const newTracksData = [{ receivedData: 'new data' }];
      expect(
        tracks(testingState, actions.fetching.received(newTracksData)),
      ).toEqual({
        ...testingState,
        results: newTracksData,
        errorFetching: false,
        finishedFetching: true,
      });
    });
  });

  describe('handling actions.fetching.error', () => {
    it('set finish fetch and error to true. Preserve results if existed.', () => {
      expect(
        tracks(testingState, actions.fetching.error()),
      ).toEqual({
        ...testingState,
        errorFetching: true,
        finishedFetching: true,
      });
    });
  });
});
