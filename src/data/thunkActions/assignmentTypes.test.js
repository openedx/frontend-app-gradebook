import lms from '../services/lms';

import actions from '../actions';
import * as thunkActions from './assignmentTypes';
import { createTestFetcher } from './testUtils';
import { fetchBulkUpgradeHistory } from './grades';

jest.mock('data/services/lms', () => ({
  api: {
    fetch: {
      assignmentTypes: jest.fn(),
    },
  },
}));
jest.mock('data/thunkActions/grades', () => ({
  fetchBulkUpgradeHistory: () => ({ type: 'fetchBulkUpgradeHistory' }),
}));

const responseData = {
  assignment_types: {
    some: 'types',
    other: 'TYpeS',
  },
  grades_frozen: 'bOOl',
  can_see_bulk_management: true,
};

describe('assignmentType thunkActions', () => {
  describe('fetchAssignmentTypes', () => {
    const testFetch = createTestFetcher(
      lms.api.fetch.assignmentTypes,
      thunkActions.fetchAssignmentTypes,
      [],
      () => expect(lms.api.fetch.assignmentTypes).toHaveBeenCalledWith(),
    );
    describe('actions dispatched on valid response', () => {
      const actionNames = [
        'fetching.started',
        'fetching.received with data.assignment_types',
        'gotGradesFrozen with data.grades_frozen',
        'config.gotBulkManagement with data.can_see_bulk_management',
      ];
      describe('if data.can_see_bulk_management', () => {
        test([...actionNames, 'fetchBulkUpgradeHistory'].join(', '), () => testFetch(
          (resolve) => resolve({ data: responseData }),
          [
            actions.assignmentTypes.fetching.started(),
            actions.assignmentTypes.fetching.received(Object.keys(responseData.assignment_types)),
            actions.assignmentTypes.gotGradesFrozen(responseData.grades_frozen),
            actions.config.gotBulkManagementConfig(responseData.can_see_bulk_management),
            fetchBulkUpgradeHistory(),
          ],
        ));
      });
      describe('if not data.can_see_bulk_management', () => {
        test(actionNames.join(', '), () => testFetch(
          (resolve) => resolve({ data: { ...responseData, can_see_bulk_management: false } }),
          [
            actions.assignmentTypes.fetching.started(),
            actions.assignmentTypes.fetching.received(Object.keys(responseData.assignment_types)),
            actions.assignmentTypes.gotGradesFrozen(responseData.grades_frozen),
            actions.config.gotBulkManagementConfig(false),
          ],
        ));
      });
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
