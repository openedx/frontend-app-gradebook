import actions, { dataKey } from './config';
import { testAction, testActionTypes } from './testUtils';

describe('actions.cohorts', () => {
  describe('action types', () => {
    const actionTypes = [
      actions.gotBulkManagementConfig,
    ].map(action => action.toString());
    testActionTypes(actionTypes, dataKey);
  });
  describe('actions provided', () => {
    test('gotBulkManagementConfig action', () => testAction(actions.gotBulkManagementConfig));
  });
});
