import { keyStore } from 'utils';
import actions from 'data/actions';

import { actionHook } from './utils';
import actionHooks from './actions';

jest.mock('./utils', () => ({
  actionHook: (action) => ({ actionHook: action }),
}));

let hooks;

const testActionHook = (hookKey, action) => {
  test(hookKey, () => {
    expect(hooks[hookKey]).toEqual(actionHook(action));
    expect(hooks[hookKey]).not.toEqual(undefined);
  });
};

describe('action hooks', () => {
  describe('app', () => {
    const hookKeys = keyStore(actionHooks.app);
    beforeEach(() => { hooks = actionHooks.app; });
    testActionHook(hookKeys.useSetLocalFilter, actions.app.setLocalFilter);
    testActionHook(hookKeys.useSetSearchValue, actions.app.setSearchValue);
    testActionHook(hookKeys.useSetShowImportSuccessToast, actions.app.setShowImportSuccessToast);
    testActionHook(hookKeys.useSetView, actions.app.setView);
    testActionHook(hookKeys.useCloseModal, actions.app.closeModal);
    testActionHook(hookKeys.useSetModalState, actions.app.setModalState);
  });
  describe('filters', () => {
    const hookKeys = keyStore(actionHooks.filters);
    const actionGroup = actions.filters.update;
    beforeEach(() => { hooks = actionHooks.filters; });
    testActionHook(hookKeys.useUpdateAssignment, actionGroup.assignment);
    testActionHook(hookKeys.useUpdateAssignmentLimits, actionGroup.assignmentLimits);
    testActionHook(hookKeys.useUpdateAssignmentType, actionGroup.assignmentType);
    testActionHook(hookKeys.useUpdateCohort, actionGroup.cohort);
    testActionHook(hookKeys.useUpdateCourseGradeLimits, actionGroup.courseGradeLimits);
    testActionHook(
      hookKeys.useUpdateIncludeCourseRoleMembers,
      actionGroup.includeCourseRoleMembers,
    );
    testActionHook(hookKeys.useResetFilters, actions.filters.reset);
  });
  describe('grades', () => {
    const hookKeys = keyStore(actionHooks.grades);
    const actionGroup = actions.grades;
    beforeEach(() => { hooks = actionHooks.grades; });
    testActionHook(hookKeys.useDoneViewingAssignment, actionGroup.doneViewingAssignment);
    testActionHook(hookKeys.useDownloadBulkGradesReport, actionGroup.downloadReport.bulkGrades);
    testActionHook(hookKeys.useDownloadInterventionReport, actionGroup.downloadReport.intervention);
    testActionHook(hookKeys.useToggleGradeFormat, actionGroup.toggleGradeFormat);
    testActionHook(hookKeys.useCloseBanner, actionGroup.banner.close);
  });
});
