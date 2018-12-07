import tracks from './tracks';
import {
  STARTED_FETCHING_TRACKS,
  ERROR_FETCHING_TRACKS,
  GOT_TRACKS,
} from '../constants/actionTypes/tracks';

const initialState = {
  results: [],
  startedFetching: false,
  errorFetching: false,
};

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

describe('tracks reducer', () => {
  it('has initial state', () => {
    expect(tracks(undefined, {})).toEqual(initialState);
  });

  it('updates fetch tracks request state', () => {
    const expected = {
      ...initialState,
      startedFetching: true,
    };
    expect(tracks(undefined, {
      type: STARTED_FETCHING_TRACKS,
    })).toEqual(expected);
  });

  it('updates fetch tracks success state', () => {
    const expected = {
      ...initialState,
      results: tracksData,
      errorFetching: false,
      finishedFetching: true,
    };
    expect(tracks(undefined, {
      type: GOT_TRACKS,
      tracks: tracksData,
    })).toEqual(expected);
  });

  it('updates fetch tracks failure state', () => {
    const expected = {
      ...initialState,
      errorFetching: true,
      finishedFetching: true,
    };
    expect(tracks(undefined, {
      type: ERROR_FETCHING_TRACKS,
    })).toEqual(expected);
  });
});
