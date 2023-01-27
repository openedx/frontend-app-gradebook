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
    const actionGroup = actions.filters.update;
    beforeEach(() => { hooks = actionHooks.filters; });
    testActionHook(hookKeys.useUpdateCohort, actionGroup.updateCohort);
    testActionHook(hookKeys.useUpdateTrack, actionGroup.updateTrack);
    testActionHook(hookKeys.useUpdateAssignment, actionGroup.assignment);
    testActionHook(hookKeys.useUpdateAssignmentLimits, actionGroup.assignmentLimits);
    testActionHook(hookKeys.useUpdateCourseGradeLimits, actionGroup.courseGradeLimits);
  });
});
