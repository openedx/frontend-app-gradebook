import { createTestFetcher } from './testUtils';

import LmsApiService from '../services/LmsApiService';
import actions from '../actions';
import selectors from '../selectors';

import { fetchBulkUpgradeHistory } from './grades';
import { fetchTracks } from './tracks';

jest.mock('../services/LmsApiService', () => ({
  fetchTracks: jest.fn(),
}));
jest.mock('../selectors', () => ({
  __esModule: true,
  default: {
    tracks: { hasMastersTrack: jest.fn(() => false) },
  },
}));
jest.mock('./grades', () => ({
  fetchBulkUpgradeHistory: jest.fn((...args) => ({ type: 'fetchBulkUpgradeHistory', args })),
}));

const courseId = 'course-v1:edX+DemoX+Demo_Course';
const responseData = {
  couse_modes: ['some', 'course', 'modes'],
};

describe('tracjs thunkActions', () => {
  describe('fetchTracks', () => {
    const testFetch = createTestFetcher(
      LmsApiService.fetchTracks,
      fetchTracks,
      [courseId],
    );
    describe('valid response', () => {
      describe('if not hasMastersTrack(data.course_modes)', () => {
        describe('dispatched actions', () => {
          beforeEach(() => {
            selectors.tracks.hasMastersTrack.mockReturnValue(false);
          });
          const expectedActions = [
            'tracks.fetching.started',
            'tracks.fetching.received with course_modes'
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
      describe('if hasMastersTrack(data.course_modes)', () => {
        describe('dispatched actions', () => {
          beforeEach(() => {
            selectors.tracks.hasMastersTrack.mockReturnValue(true);
          });
          const expectedActions = [
            'fetching.started',
            'fetching.received with course_modes',
            'fetchBulkUpgradeHistory thunkAction with courseId',
          ];
          test(`[${expectedActions.join(', ')}]`, () => testFetch(
            (resolve) => resolve({ data: responseData }),
            [
              actions.tracks.fetching.started(),
              actions.tracks.fetching.received(responseData.course_modes),
              fetchBulkUpgradeHistory(courseId),
            ],
          ));
        });
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
