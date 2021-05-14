import tracks, { initialState } from './tracks';
import actions from '../actions/tracks';

const tracksData = [
  {
    slug: 'audit',
    name: 'Audit',
    min_price: 0,
    suggested_prices: '',
    currency: 'usd',
    expiration_datetime: null,
    description: null,
    sku: '68EFFFF',
    bulk_sku: null,
  },
  {
    slug: 'verified',
    name: 'Verified Certificate',
    min_price: 100,
    suggested_prices: '',
    currency: 'usd',
    expiration_datetime: '2021-05-04T18:08:12.644361Z',
    description: null,
    sku: '8CF08E5',
    bulk_sku: 'A5B6DBE',
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
          slug: 'audit',
          name: 'New Audit',
          min_price: 0,
          suggested_prices: '',
          currency: 'usd',
          expiration_datetime: null,
          description: null,
          sku: '68EFFFF',
          bulk_sku: null,
        },
        {
          slug: 'verified',
          name: 'New Verified Certificate',
          min_price: 100,
          suggested_prices: '',
          currency: 'usd',
          expiration_datetime: '2021-05-04T18:08:12.644361Z',
          description: null,
          sku: '8CF08E5',
          bulk_sku: 'A5B6DBE',
        }];
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
