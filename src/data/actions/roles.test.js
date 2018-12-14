import configureMockStore from 'redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import thunk from 'redux-thunk';

import apiClient from '../apiClient';
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
const axiosMock = new MockAdapter(apiClient);

const rolesUrl = `${configuration.LMS_BASE_URL}/api/enrollment/v1/roles/`;

const course1Id = 'course-v1:edX+DemoX+Demo_Course';
const course2Id = 'course-v1:edX+DemoX+Demo_Course_2';

function makeRoleObj(courseId, role) {
  return {
    course_id: courseId,
    role: role,
  }
};

const course1StaffRole = makeRoleObj(course1Id, "staff");
const course1DummyRole = makeRoleObj(course1Id, "dummy");
const course2StaffRole = makeRoleObj(course2Id, "staff");
const course2DummyRole = makeRoleObj(course2Id, "dummy");
const urlParams = { cohort: null, track: null };

describe('actions', () => {
  afterEach(() => {
    axiosMock.reset();
  });

  describe('getRoles', () => {
    it('dispatches got_roles action and subsequent actions after fetching role that allows gradebook', () => {
      const expectedActions = [
        { type: GOT_ROLES, canUserViewGradebook: true },
        { type: STARTED_FETCHING_GRADES },
        { type: STARTED_FETCHING_TRACKS },
        { type: STARTED_FETCHING_COHORTS },
        { type: STARTED_FETCHING_ASSIGNMENT_TYPES },
      ];
      const store = mockStore();
      axiosMock.onGet(rolesUrl)
      .replyOnce(200, JSON.stringify([course1StaffRole, course2DummyRole]));

      return store.dispatch(getRoles(course1Id, urlParams)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('dispatches got_roles action and no other actions after fetching role that disallows gradebook', () => {
      const expectedActions = [
        { type: GOT_ROLES, canUserViewGradebook: false },
      ];
      const store = mockStore();

      axiosMock.onGet(rolesUrl)
      .replyOnce(200, JSON.stringify([course1DummyRole, course2StaffRole]));

      return store.dispatch(getRoles(course1Id, urlParams)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('dispatches got_roles action and no other actions after fetching empty roles', () => {
      const expectedActions = [
        { type: GOT_ROLES, canUserViewGradebook: false },
      ];
      const store = mockStore();

      axiosMock.onGet(rolesUrl)
      .replyOnce(200, JSON.stringify([]));

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
