import actions, { dataKey } from './assignmentTypes';
import { testAction, testActionTypes } from './testUtils';

describe('actions', () => {
  describe('action types', () => {
    const actionTypes = [
      actions.fetching.error,
      actions.fetching.started,
      actions.fetching.received,
      actions.gotGradesFrozen,
    ].map(action => action.toString());
    testActionTypes(actionTypes, dataKey);
  });
  describe('actions provided', () => {
    describe('fetching actions', () => {
      test('error action', () => testAction(actions.fetching.error));
      test('started action', () => testAction(actions.fetching.started));
      test('received action', () => testAction(actions.fetching.received));
    });
    test('gotGradesFrozen action', () => testAction(actions.gotGradesFrozen));
  });
});
