import actions, { dataKey } from './tracks';
import { testAction, testActionTypes } from './testUtils';

describe('actions.tracks', () => {
  describe('action types', () => {
    const actionTypes = [
      actions.fetching.error,
      actions.fetching.started,
      actions.fetching.received,
    ].map(action => action.toString());
    testActionTypes(actionTypes, dataKey);
  });
  describe('actions provided', () => {
    describe('fecthing actions', () => {
      test('error action', () => testAction(actions.fetching.error));
      test('started action', () => testAction(actions.fetching.started));
      test('received action', () => testAction(actions.fetching.received));
    });
  });
});
