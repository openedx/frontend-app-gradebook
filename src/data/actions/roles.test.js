import actions, { dataKey } from './roles';
import { testAction, testActionTypes } from './testUtils';

describe('actions.roles', () => {
  describe('action types', () => {
    const actionTypes = [
      actions.fetching.error,
      actions.fetching.received,
    ].map(action => action.toString());
    testActionTypes(actionTypes, dataKey);
  });
  describe('actions provided', () => {
    describe('fecthing actions', () => {
      test('error action', () => testAction(actions.fetching.error));
      test('received action', () => testAction(actions.fetching.received));
    });
  });
});
