import axios from 'axios';
import configureMockStore from 'redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import thunk from 'redux-thunk';

import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { configuration } from '../../config';
import { fetchAssignmentTypes } from './assignmentTypes';
import {
  STARTED_FETCHING_ASSIGNMENT_TYPES,
  GOT_ASSIGNMENT_TYPES,
  ERROR_FETCHING_ASSIGNMENT_TYPES,
  GOT_ARE_GRADES_FROZEN,
} from '../constants/actionTypes/assignmentTypes';
import GOT_BULK_MANAGEMENT_CONFIG from '../constants/actionTypes/config';

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

  describe('fetchAssignmentTypes', () => {
    const courseId = 'course-v1:edX+DemoX+Demo_Course';
    const responseData = {
      assignment_types: {
        Exam: {
          drop_count: 0,
          min_count: 1,
          short_label: 'Exam',
          type: 'Exam',
          weight: 0.25,
        },
        Homework: {
          drop_count: 1,
          min_count: 3,
          short_label: 'Ex',
          type: 'Homework',
          weight: 0.75,
        },
      },
      grades_frozen: false,
      can_see_bulk_management: true,
    };
    it('dispatches success action after fetching fetchAssignmentTypes', () => {
      const expectedActions = [
        { type: STARTED_FETCHING_ASSIGNMENT_TYPES },
        { type: GOT_ASSIGNMENT_TYPES, assignmentTypes: Object.keys(responseData.assignment_types) },
        { type: GOT_ARE_GRADES_FROZEN, areGradesFrozen: responseData.grades_frozen },
        { type: GOT_BULK_MANAGEMENT_CONFIG, data: true },
      ];
      const store = mockStore();

      axiosMock.onGet(`${configuration.LMS_BASE_URL}/api/grades/v1/gradebook/${courseId}/grading-info?graded_only=true`)
        .replyOnce(200, JSON.stringify(responseData));

      return store.dispatch(fetchAssignmentTypes(courseId)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('dispatches failure action after fetching cohorts', () => {
      const expectedActions = [
        { type: STARTED_FETCHING_ASSIGNMENT_TYPES },
        { type: ERROR_FETCHING_ASSIGNMENT_TYPES },
      ];
      const store = mockStore();

      axiosMock.onGet(`${configuration.LMS_BASE_URL}/api/grades/v1/gradebook/${courseId}/grading-info?graded_only=true`)
        .replyOnce(500, JSON.stringify({}));

      return store.dispatch(fetchAssignmentTypes(courseId)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('dispatches frozen grade action with True value after fetching', () => {
      const expectedActions = [
        { type: STARTED_FETCHING_ASSIGNMENT_TYPES },
        { type: GOT_ASSIGNMENT_TYPES, assignmentTypes: Object.keys(responseData.assignment_types) },
        { type: GOT_ARE_GRADES_FROZEN, areGradesFrozen: true },
        { type: GOT_BULK_MANAGEMENT_CONFIG, data: true },
      ];
      const store = mockStore();
      responseData.grades_frozen = true;
      axiosMock.onGet(`${configuration.LMS_BASE_URL}/api/grades/v1/gradebook/${courseId}/grading-info?graded_only=true`)
        .replyOnce(200, JSON.stringify(responseData));

      return store.dispatch(fetchAssignmentTypes(courseId)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });
});
