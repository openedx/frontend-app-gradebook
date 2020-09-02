import axios from 'axios';
import configureMockStore from 'redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import thunk from 'redux-thunk';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

import { configuration } from '../../config';
import { getRoles } from './roles';
import {
  GOT_ROLES,
  ERROR_FETCHING_ROLES,
} from '../constants/actionTypes/roles';
import { STARTED_FETCHING_GRADES } from '../constants/actionTypes/grades';
import { STARTED_FETCHING_TRACKS } from '../constants/actionTypes/tracks';
import { STARTED_FETCHING_COHORTS } from '../constants/actionTypes/cohorts';
import { STARTED_FETCHING_ASSIGNMENT_TYPES } from '../constants/actionTypes/assignmentTypes';

const mockStore = configureMockStore([thunk]);

jest.mock('@edx/frontend-platform/auth');
const axiosMock = new MockAdapter(axios);
getAuthenticatedHttpClient.mockReturnValue(axios);
axios.isAccessTokenExpired = jest.fn();
axios.isAccessTokenExpired.mockReturnValue(false);

const course1Id = 'course-v1:edX+DemoX+Demo_Course';
const course2Id = 'course-v1:edX+DemoX+Demo_Course_2';
const rolesUrl = `${configuration.LMS_BASE_URL}/api/enrollment/v1/roles/?course_id=${encodeURIComponent(course1Id)}`;

function makeRoleListObj(roles, isGlobalStaff) {
  return {
    roles,
    is_staff: isGlobalStaff,
  };
}
function makeRoleObj(courseId, role) {
  return {
    course_id: courseId,
    role,
  };
}

const course1StaffRole = makeRoleObj(course1Id, 'staff');
const course1DummyRole = makeRoleObj(course1Id, 'dummy');
const course2StaffRole = makeRoleObj(course2Id, 'staff');
const course2DummyRole = makeRoleObj(course2Id, 'dummy');
const urlParams = { cohort: null, track: null };

describe('actions', () => {
  afterEach(() => {
    axiosMock.reset();
  });

  describe('getRoles', () => {
    it('dispatches got_roles action and subsequent actions after fetching role that allows gradebook', () => {
      const expectedActions = [
        { type: GOT_ROLES, canUserViewGradebook: true, courseId: course1Id },
        { type: STARTED_FETCHING_GRADES },
        { type: STARTED_FETCHING_TRACKS },
        { type: STARTED_FETCHING_COHORTS },
        { type: STARTED_FETCHING_ASSIGNMENT_TYPES },
      ];
      const store = mockStore();
      axiosMock.onGet(rolesUrl)
        .replyOnce(
          200,
          JSON.stringify(makeRoleListObj([course1StaffRole, course2DummyRole], false)),
        );

      return store.dispatch(getRoles(course1Id, urlParams)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('dispatches got_roles action and other actions after fetching irrelevent roles but user is global staff', () => {
      const expectedActions = [
        { type: GOT_ROLES, canUserViewGradebook: true, courseId: course1Id },
        { type: STARTED_FETCHING_GRADES },
        { type: STARTED_FETCHING_TRACKS },
        { type: STARTED_FETCHING_COHORTS },
        { type: STARTED_FETCHING_ASSIGNMENT_TYPES },
      ];
      const store = mockStore();

      axiosMock.onGet(rolesUrl)
        .replyOnce(
          200,
          JSON.stringify(makeRoleListObj([course1DummyRole, course2DummyRole], true)),
        );

      return store.dispatch(getRoles(course1Id, urlParams)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('dispatches got_roles action and no other actions after fetching role that disallows gradebook', () => {
      const expectedActions = [
        {
          type: GOT_ROLES, canUserViewGradebook: false, courseId: course1Id,
        },
      ];
      const store = mockStore();

      axiosMock.onGet(rolesUrl)
        .replyOnce(
          200,
          JSON.stringify(makeRoleListObj([course1DummyRole, course2StaffRole], false)),
        );

      return store.dispatch(getRoles(course1Id, urlParams)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('dispatches got_roles action and no other actions after fetching empty roles', () => {
      const expectedActions = [
        { type: GOT_ROLES, canUserViewGradebook: false, courseId: course1Id },
      ];
      const store = mockStore();

      axiosMock.onGet(rolesUrl)
        .replyOnce(
          200,
          JSON.stringify(makeRoleListObj([], false)),
        );

      return store.dispatch(getRoles(course1Id, urlParams)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('dispatches got_roles action and other actions after fetching empty roles but user is global staff', () => {
      const expectedActions = [
        { type: GOT_ROLES, canUserViewGradebook: true, courseId: course1Id },
        { type: STARTED_FETCHING_GRADES },
        { type: STARTED_FETCHING_TRACKS },
        { type: STARTED_FETCHING_COHORTS },
        { type: STARTED_FETCHING_ASSIGNMENT_TYPES },
      ];
      const store = mockStore();

      axiosMock.onGet(rolesUrl)
        .replyOnce(
          200,
          JSON.stringify(makeRoleListObj([], true)),
        );

      return store.dispatch(getRoles(course1Id, urlParams)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('dispatches error action after getting an error when trying to get roles', () => {
      const expectedActions = [
        { type: ERROR_FETCHING_ROLES },
      ];
      const store = mockStore();

      axiosMock.onGet(rolesUrl).replyOnce(400);

      return store.dispatch(getRoles(course1Id, urlParams)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });
});
