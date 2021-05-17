import tracks, { initialState } from './tracks';
import actions from '../actions/tracks';

const tracksData = [
  {
    someArbitraryField: 'arbitrary data',
  },
  {
    anotherArbitraryField: 'more arbitrary data',
  }];

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
      const expected = {
        ...testingState,
        startedFetching: true,
      };
      expect(
        tracks(testingState, actions.fetching.started()),
      ).toEqual(expected);
    });
  });

  describe('handling actions.fetching.received', () => {
    it('replace results then set finish fetching to true and error to false', () => {
      const newTraksData = [
        {
          receivedData: 'new data',
        },
      ];
      const expected = {
        ...testingState,
        results: newTraksData,
        errorFetching: false,
        finishedFetching: true,
      };
      expect(
        tracks(testingState, actions.fetching.received(newTraksData)),
      ).toEqual(expected);
    });
  });

  describe('handling actions.fetching.error', () => {
    it('set finish fetch and error to true. Preserve results if existed.', () => {
      const expected = {
        ...testingState,
        errorFetching: true,
        finishedFetching: true,
      };
      expect(
        tracks(testingState, actions.fetching.error()),
      ).toEqual(expected);
    });
  });
});
