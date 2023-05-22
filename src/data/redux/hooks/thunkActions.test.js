import { keyStore } from 'utils';
import thunkActions from 'data/thunkActions';
import { actionHook } from './utils';
import thunkActionHooks from './thunkActions';

jest.mock('data/thunkActions', () => ({
  app: {
    filterMenu: {
      close: jest.fn(),
      handleTransitionEnd: jest.fn(),
      toggle: jest.fn(),
    },
  },
  grades: {
    fetchGrades: jest.fn(),
    fetchGradesIfAssignmentGradeFiltersSet: jest.fn(),
    submitImportGradesButtonData: jest.fn(),
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
let hookKeys;
describe('thunkAction hooks', () => {
  describe('app', () => {
    hookKeys = keyStore(thunkActionHooks.app);
    beforeEach(() => { hooks = thunkActionHooks.app; });
    testActionHook(hookKeys.useSetModalStateFromTable, thunkActions.app.setModalStateFromTable);

    describe('filterMenu', () => {
      hookKeys = keyStore(thunkActionHooks.app.filterMenu);
      beforeEach(() => { hooks = thunkActionHooks.app.filterMenu; });
      testActionHook(hookKeys.useCloseMenu, thunkActions.app.filterMenu.close);
      testActionHook(
        hookKeys.useHandleTransitionEnd,
        thunkActions.app.filterMenu.handleTransitionEnd,
      );
      testActionHook(hookKeys.useToggleMenu, thunkActions.app.filterMenu.toggle);
    });
  });
  describe('grades', () => {
    hookKeys = keyStore(thunkActionHooks.grades);
    const actionGroup = thunkActions.grades;
    beforeEach(() => { hooks = thunkActionHooks.grades; });
    testActionHook(
      hookKeys.useFetchGradesIfAssignmentGradeFiltersSet,
      actionGroup.fetchGradesIfAssignmentGradeFiltersSet,
    );
    testActionHook(hookKeys.useFetchPrevNextGrades, actionGroup.fetchPrevNextGrades);
    testActionHook(hookKeys.useFetchGrades, actionGroup.fetchGrades);
    testActionHook(
      hookKeys.useSubmitImportGradesButtonData,
      actionGroup.submitImportGradesButtonData,
    );
    testActionHook(hookKeys.useUpdateGrades, actionGroup.updateGrades);
  });
});
