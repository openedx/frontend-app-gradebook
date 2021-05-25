import LmsApiService from '../services/LmsApiService';

import actions from '../actions';
import * as thunkActions from './assignmentTypes';
import { createTestFetcher } from './testUtils';

jest.mock('../services/LmsApiService', () => ({
  fetchAssignmentTypes: jest.fn(),
}));

const responseData = {
  assignment_types: {
    some: 'types',
    other: 'TYpeS',
  },
  grades_frozen: 'bOOl',
  can_see_bulk_management: 'BooL',
};

describe('assignmentType thunkActions', () => {
  describe('fetchAssignmentTypes', () => {
    const courseId = 'course-v1:edX+DemoX+Demo_Course';
    const testFetch = createTestFetcher(
      LmsApiService.fetchAssignmentTypes,
      thunkActions.fetchAssignmentTypes,
      [courseId],
    );
    describe('actions dispatched on valid response', () => {
      const actionNames = [
        'fetching.started',
        'fetching.received with data.assignment_types',
        'gotGradesFrozen with data.grades_frozen',
        'config.gotBulkManagement with data.can_see_bulk_management',
      ];
      test(actionNames.join(', '), () => testFetch(
        (resolve) => resolve({ data: responseData }),
        [
          actions.assignmentTypes.fetching.started(),
          actions.assignmentTypes.fetching.received(Object.keys(responseData.assignment_types)),
          actions.assignmentTypes.gotGradesFrozen(responseData.grades_frozen),
          actions.config.gotBulkManagementConfig(responseData.can_see_bulk_management),
        ],
      ));
    });
    describe('actions dispatched on api error', () => {
      test('fetching.started, fetching.error', () => testFetch(
        (resolve, reject) => reject(),
        [
          actions.assignmentTypes.fetching.started(),
          actions.assignmentTypes.fetching.error(),
        ],
      ));
    });
  });
});
