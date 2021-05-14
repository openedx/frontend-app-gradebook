import LmsApiService from '../services/LmsApiService';

import actions from '../actions';
import * as thunkActions from './cohorts';
import { createTestFetcher } from './testUtils';

jest.mock('../services/LmsApiService', () => ({
  fetchCohorts: jest.fn(),
}));

const responseData = {
  cohorts: {
    some: 'COHorts',
    other: 'cohORT$',
  },
};

describe('cohorts thunkActions', () => {
  describe('fetchCohorts', () => {
    const courseId = 'course-v1:edX+DemoX+Demo_Course';
    const testFetch = createTestFetcher(
      LmsApiService.fetchCohorts,
      thunkActions.fetchCohorts,
      [courseId],
    );
    describe('actions dispatched on valid response', () => {
      test('fetching.started, fetching.received', () => {
        return testFetch((resolve) => resolve({ data: responseData }), [
          actions.cohorts.fetching.started(),
          actions.cohorts.fetching.received(responseData.cohorts),
        ]);
      });
    });
    describe('actions dispatched on api error', () => {
      test('fetching.started, fetching.error', () => testFetch(
        (resolve, reject) => reject(),
        [
          actions.cohorts.fetching.started(),
          actions.cohorts.fetching.error(),
        ],
      ));
    });
  });
});
