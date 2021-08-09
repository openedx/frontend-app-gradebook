import lms from 'data/services/lms';
import actions from 'data/actions';

import { createTestFetcher } from './testUtils';

import { fetchTracks } from './tracks';

jest.mock('data/services/lms', () => ({
  api: {
    fetch: { tracks: jest.fn() },
  },
}));
jest.mock('data/selectors', () => ({
  __esModule: true,
  default: {
    root: { showBulkManagement: jest.fn(() => false) },
  },
}));
jest.mock('./grades', () => ({
  fetchBulkUpgradeHistory: jest.fn((...args) => ({ type: 'fetchBulkUpgradeHistory', args })),
}));

const responseData = {
  couse_modes: ['some', 'course', 'modes'],
};

describe('tracks thunkActions', () => {
  describe('fetchTracks', () => {
    const testFetch = createTestFetcher(
      lms.api.fetch.tracks,
      fetchTracks,
      [],
      () => expect(lms.api.fetch.tracks).toHaveBeenCalledWith(),
    );
    describe('valid response', () => {
      describe('dispatched actions', () => {
        const expectedActions = [
          'tracks.fetching.started',
          'tracks.fetching.received with course_modes',
        ];
        it(`dispatches [${expectedActions.join(', ')}]`, () => testFetch(
          (resolve) => resolve({ data: responseData }),
          [
            actions.tracks.fetching.started(),
            actions.tracks.fetching.received(responseData.course_modes),
          ],
        ));
      });
    });
    describe('actions dispatched on api error', () => {
      test('errorFetching', () => testFetch(
        (resolve, reject) => reject(),
        [
          actions.tracks.fetching.started(),
          actions.tracks.fetching.error(),
        ],
      ));
    });
  });
});
