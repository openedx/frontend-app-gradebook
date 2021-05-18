import actions from './assignmentTypes';

describe('actions', () => {
  describe('action types', () => {
    const actionTypes = [
      actions.fetching.error,
      actions.fetching.started,
      actions.fetching.createAction,
      actions.gotGradesFrozen,
    ].map(action => action.toString());
    test('all types are unique', () => {
      expect(actionTypes.length).toEqual((new Set(actionTypes)).size);
    });
    test('all types begin with "assignmentTypes" key', () => {
      actionTypes.forEach(type => {
        expect(type.startsWith('assignmentTypes')).toEqual(true);
      });
    });
  });
  describe('actions provided', () => {
    const payload = { test: 'PAYload' };
    const testAction = (action) => {
      expect(action(payload)).toEqual({ type: action.toString(), payload });
    };
    describe('fecthing actions', () => {
      test('error action', () => testAction(actions.fetching.error));
      test('started action', () => testAction(actions.fetching.started));
      test('received action', () => testAction(actions.fetching.received));
    });
    test('gotGradesFrozen action', () => testAction(actions.gotGradesFozen));
  });
});
