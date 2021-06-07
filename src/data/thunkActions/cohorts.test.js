import LmsApiService from '../services/LmsApiService';

import actions from '../actions';
import selectors from '../selectors';
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
  const courseId = 'course-v1:edX+DemoX+Demo_Course';
  beforeEach(() => {
    selectors.app.courseId = jest.fn(() => courseId);
  });
  describe('fetchCohorts', () => {
    const testFetch = createTestFetcher(
      LmsApiService.fetchCohorts,
      thunkActions.fetchCohorts,
      [],
      () => expect(LmsApiService.fetchCohorts).toHaveBeenCalledWith(courseId),
    );
    describe('actions dispatched on valid response', () => {
      test('fetching.started, fetching.received', () => testFetch(
        (resolve) => resolve({ data: responseData }),
        [
          actions.cohorts.fetching.started(),
          actions.cohorts.fetching.received(responseData.cohorts),
        ],
      ));
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
