import axios from 'axios';
import configureMockStore from 'redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import thunk from 'redux-thunk';

import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { configuration } from '../../config';
import { fetchTracks } from './tracks';
import {
  STARTED_FETCHING_TRACKS,
  GOT_TRACKS,
  ERROR_FETCHING_TRACKS,
} from '../constants/actionTypes/tracks';

const mockStore = configureMockStore([thunk]);

jest.mock('@edx/frontend-platform/auth');
const axiosMock = new MockAdapter(axios);
getAuthenticatedHttpClient.mockReturnValue(axios);
axios.isAccessTokenExpired = jest.fn();
axios.isAccessTokenExpired.mockReturnValue(false);

describe('actions', () => {
  afterEach(() => {
    axiosMock.reset();
  });

  describe('fetchTracks', () => {
    const courseId = 'course-v1:edX+DemoX+Demo_Course';
    const trackUrl = `${configuration.LMS_BASE_URL}/api/enrollment/v1/course/${courseId}?include_expired=1`;

    it('dispatches success action after fetching tracks', () => {
      const responseData = {
        course_modes: [
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
          }],
      };
      const expectedActions = [
        { type: STARTED_FETCHING_TRACKS },
        { type: GOT_TRACKS, tracks: responseData.course_modes },
      ];
      const store = mockStore();

      axiosMock.onGet(trackUrl)
        .replyOnce(200, JSON.stringify(responseData));

      return store.dispatch(fetchTracks(courseId)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('dispatches failure action after fetching tracks', () => {
      const expectedActions = [
        { type: STARTED_FETCHING_TRACKS },
        { type: ERROR_FETCHING_TRACKS },
      ];
      const store = mockStore();

      axiosMock.onGet(trackUrl)
        .replyOnce(500, JSON.stringify({}));

      return store.dispatch(fetchTracks(courseId)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });
});
