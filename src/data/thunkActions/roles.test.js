import { createTestFetcher } from './testUtils';

import LmsApiService from '../services/LmsApiService';
import actions from '../actions';
import selectors from '../selectors';

import { fetchAssignmentTypes } from './assignmentTypes';
import { fetchCohorts } from './cohorts';
import { fetchGrades } from './grades';
import { fetchTracks } from './tracks';

import { allowedRoles, fetchRoles } from './roles';

jest.mock('../selectors', () => ({
  __esModule: true,
  default: {
    filters: {
      allFilters: jest.fn(),
    },
  },
}));
jest.mock('../services/LmsApiService', () => ({
  fetchUserRoles: jest.fn(),
}));
jest.mock('./assignmentTypes', () => ({
  fetchAssignmentTypes: jest.fn((...args) => ({ type: 'fetchAssignmentTypes', args })),
}));
jest.mock('./cohorts', () => ({
  fetchCohorts: jest.fn((...args) => ({ type: 'fetchCohorts', args })),
}));
jest.mock('./grades', () => ({
  fetchGrades: jest.fn((...args) => ({ type: 'fetchGrades', args })),
}));
jest.mock('./tracks', () => ({
  fetchTracks: jest.fn((...args) => ({ type: 'fetchTracks', args })),
}));

const courseId = 'course-v1:edX+DemoX+Demo_Course';
const allowedRole = { course_id: courseId, role: allowedRoles[0] };
const responseData = {
  roles: [
    { course_id: 'fakeCourseId', role: 'fakeROLE' },
    { couse_id: 'anotherId', role: 'STuff' },
  ],
  is_staff: false,
};

describe('roles thunkActions', () => {
  const filters = {
    cohort: 'COHort',
    track: 'traCK',
    assignmentType: 23,
  };
  beforeAll(() => {
    selectors.filters.allFilters.mockReturnValue(filters);
  });
  describe('fetchRoles', () => {
    const testFetch = createTestFetcher(
      LmsApiService.fetchUserRoles,
      fetchRoles,
      [courseId],
    );
    describe('valid response', () => {
      describe('cannot view gradebook (not is_staff, and no allowed roles)', () => {
        it('dispatches received with canUserViewGradeBook=false and the courseId', () => (
          testFetch((resolve) => resolve({ data: responseData }), [
            actions.roles.fetching.received({
              canUserViewGradebook: false,
              courseId,
            }),
          ])
        ));
      });
      describe('canUserViewGradebook (is_staff or some role is allowed)', () => {
        const testCanUserViewGradebookOutput = (resolveData) => {
          const resolveFn = (resolve) => resolve({ data: resolveData });
          const expectedActions = [
            'received with canUserViewGradebook=false and the courseId',
            'fetchGrades thunkAction with courseId and filters(cohort, track, and assignmentType)',
            'fetchTracks thunkAction with courseId',
            'fetchCohorts thunkAction with courseId',
            'fetchAssignmentTypes thunkAction with courseId',
          ];
          it(`dispatches the appropriate actions:  [\n  ${expectedActions.join('\n  ')}\n]`, () => testFetch(
            resolveFn,
            [
              actions.roles.fetching.received({ canUserViewGradebook: true, courseId }),
              fetchGrades(courseId, filters.cohort, filters.track, filters.assignmentType),
              fetchTracks(courseId),
              fetchCohorts(courseId),
              fetchAssignmentTypes(courseId),
            ],
          ));
        };
        describe('is_staff', () => testCanUserViewGradebookOutput({
          ...responseData,
          is_staff: true,
        }));
        describe('has allowed role', () => testCanUserViewGradebookOutput({
          ...responseData,
          roles: [...responseData.roles, allowedRole],
        }));
      });
    });
    describe('actions dispatched on api error', () => {
      test('errorFetching', () => testFetch(
        (resolve, reject) => reject(),
        [actions.roles.fetching.error()],
      ));
    });
  });
});
