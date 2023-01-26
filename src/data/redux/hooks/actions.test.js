import { keyStore } from 'utils';
import actions from 'data/actions';

import { actionHook } from './utils';
import actionHooks from './actions';

jest.mock('data/actions', () => ({
  app: {
    setLocalFilter: jest.fn(),
  },
  filters: {
    update: {
      assignment: jest.fn(),
      assignmentLimits: jest.fn(),
    },
  },
}));
jest.mock('./utils', () => ({
  actionHook: (action) => ({ actionHook: action }),
}));

let hooks;

const testActionHook = (hookKey, action) => {
  test(hookKey, () => {
    expect(hooks[hookKey]).toEqual(actionHook(action));
  });
};

describe('action hooks', () => {
  describe('app', () => {
    const hookKeys = keyStore(actionHooks.app);
    beforeEach(() => { hooks = actionHooks.app; });
    testActionHook(hookKeys.useSetLocalFilter, actions.app.setLocalFilter);
  });
  describe('filters', () => {
    const hookKeys = keyStore(actionHooks.filters);
    beforeEach(() => { hooks = actionHooks.filters; });
    testActionHook(hookKeys.useUpdateAssignment, actions.filters.update.assignment);
    testActionHook(hookKeys.useUpdateAssignmentLimits, actions.filters.update.assignmentLimits);
  });
});
