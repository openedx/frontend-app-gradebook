import lms from 'data/services/lms';
import actions from 'data/actions';
import selectors from 'data/selectors';

import { fetchAssignmentTypes } from './assignmentTypes';
import { fetchCohorts } from './cohorts';
import { fetchGrades } from './grades';
import { fetchTracks } from './tracks';
import { allowedRoles, fetchRoles } from './roles';
import { createTestFetcher } from './testUtils';

jest.mock('data/selectors', () => ({
  __esModule: true,
  default: {
    filters: {
      allFilters: jest.fn(),
    },
    root: {},
    app: {},
  },
}));
jest.mock('data/services/lms', () => ({
  api: {
    fetch: { roles: jest.fn() },
  },
}));
jest.mock('./assignmentTypes', () => ({
  fetchAssignmentTypes: jest.fn((...args) => ({ type: 'fetchAssignmentTypes', args })),
}));
jest.mock('./cohorts', () => ({
  fetchCohorts: jest.fn((...args) => ({ type: 'fetchCohorts', args })),
}));
jest.mock('./grades', () => ({
  fetchGrades: jest.fn((...args) => ({ type: 'fetchGrades', args })),
  fetchBulkUpgradeHistory: jest.fn((...args) => ({ type: 'fetchBulkUpgradeHistory', args })),
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
    selectors.app.courseId = jest.fn(() => courseId);
  });
  describe('fetchRoles', () => {
    const testFetch = createTestFetcher(
      lms.api.fetch.roles,
      fetchRoles,
      [],
      () => expect(lms.api.fetch.roles).toHaveBeenCalledWith(),
    );
    describe('valid response', () => {
      describe('cannot view gradebook (not is_staff, and no allowed roles)', () => {
        it('dispatches received with canUserViewGradeBook=false and the courseId', () => (
          testFetch((resolve) => resolve({ data: responseData }), [
            actions.roles.fetching.received({
              canUserViewGradebook: false,
            }),
          ])
        ));
      });
      describe('canUserViewGradebook (is_staff or some role is allowed)', () => {
        const testCanUserViewGradebookOutput = (resolveData) => {
          const resolveFn = (resolve) => resolve({ data: resolveData });
          const expectedActions = [
            'received with canUserViewGradebook=false',
            'fetchGrades thunkAction with and filters(cohort, track, and assignmentType)',
            'fetchTracks thunkAction',
            'fetchCohorts thunkAction',
            'fetchAssignmentTypes thunkAction',
          ];
          it(`dispatches the appropriate actions:  [\n  ${expectedActions.join('\n  ')}\n]`, () => testFetch(
            resolveFn,
            [
              actions.roles.fetching.received({ canUserViewGradebook: true }),
              fetchGrades(),
              fetchTracks(),
              fetchCohorts(),
              fetchAssignmentTypes(),
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
