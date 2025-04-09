import lms from '@src/data/services/lms';

import actions from '@src/data/actions';
import * as thunkActions from './cohorts';
import { createTestFetcher } from './testUtils';

jest.mock('data/services/lms', () => ({
  api: {
    fetch: { cohorts: jest.fn() },
  },
}));

const responseData = {
  data: {
    some: 'COHorts',
    other: 'cohORT$',
  },
};

describe('cohorts thunkActions', () => {
  describe('fetchCohorts', () => {
    const testFetch = createTestFetcher(
      lms.api.fetch.cohorts,
      thunkActions.fetchCohorts,
      [],
      () => expect(lms.api.fetch.cohorts).toHaveBeenCalledWith(),
    );
    describe('actions dispatched on valid response', () => {
      test('fetching.started, fetching.received', () => testFetch(
        (resolve) => resolve(responseData),
        [
          actions.cohorts.fetching.started(),
          actions.cohorts.fetching.received(responseData.data),
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
