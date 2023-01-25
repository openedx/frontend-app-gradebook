import actions from 'data/actions';
import { actionHook } from './utils';
import actionHooks from './actions';

jest.mock('data/actions', () => ({
  filters: {
    update: { assignment: jest.fn() },
  },
}));
jest.mock('./utils', () => ({
  actionHook: (action) => ({ actionHook: action }),
}));

let hooks;

describe('action hooks', () => {
  describe('filters', () => {
    hooks = actionHooks.filters;
    test('useUpdateAssignment', () => {
      expect(hooks.useUpdateAssignment).toEqual(actionHook(actions.filters.update.assignment));
    });
  });
});
