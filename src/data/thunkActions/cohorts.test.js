import axios from 'axios';
import configureMockStore from 'redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import thunk from 'redux-thunk';

import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { configuration } from '../../config';
import { fetchCohorts } from './cohorts';
import actions from '../actions';

const mockStore = configureMockStore([thunk]);

jest.mock('@edx/frontend-platform/auth');
const axiosMock = new MockAdapter(axios);
getAuthenticatedHttpClient.mockReturnValue(axios);
axios.isAccessTokenExpired = jest.fn();
axios.isAccessTokenExpired.mockReturnValue(false);

describe('cohort thunkActions', () => {
  afterEach(() => {
    axiosMock.reset();
  });

  describe('fetchCohorts', () => {
    const courseId = 'course-v1:edX+DemoX+Demo_Course';

    it('dispatches success action after fetching cohorts', () => {
      const responseData = {
        cohorts: [
          {
            assignment_type: 'manual',
            group_id: null,
            id: 1,
            name: 'default_group',
            user_count: 2,
            user_partition_id: null,
          },
          {
            assignment_type: 'auto',
            group_id: null,
            id: 2,
            name: 'auto_group',
            user_count: 5,
            user_partition_id: null,
          }],
      };
      const expectedActions = [
        actions.cohorts.fetching.started(),
        actions.cohorts.fetching.received(responseData.cohorts),
      ];
      const store = mockStore();

      axiosMock.onGet(`${configuration.LMS_BASE_URL}/courses/${courseId}/cohorts/`)
        .replyOnce(200, JSON.stringify(responseData));

      return store.dispatch(fetchCohorts(courseId)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('dispatches failure action after fetching cohorts', () => {
      const expectedActions = [
        actions.cohorts.fetching.started(),
        actions.cohorts.fetching.error(),
      ];
      const store = mockStore();

      axiosMock.onGet(`${configuration.LMS_BASE_URL}/courses/${courseId}/cohorts/`)
        .replyOnce(500, JSON.stringify({}));

      return store.dispatch(fetchCohorts(courseId)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });
});
