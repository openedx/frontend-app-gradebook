import { keyStore } from 'utils';
import thunkActions from 'data/thunkActions';
import { actionHook } from './utils';
import thunkActionHooks from './thunkActions';

jest.mock('data/thunkActions', () => ({
  app: {
    filterMenu: { close: jest.fn() },
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
describe('thunkAction hooks', () => {
  describe('app', () => {
    const hookKeys = keyStore(thunkActionHooks.app);
    beforeEach(() => { hooks = thunkActionHooks.app; });
    testActionHook(hookKeys.useCloseFilterMenu, thunkActions.app.filterMenu.close);
  });
  describe('grades', () => {
    const hookKeys = keyStore(thunkActionHooks.grades);
    const actionGroup = thunkActions.grades;
    beforeEach(() => { hooks = thunkActionHooks.grades; });
    testActionHook(hookKeys.useFetchGrades, actionGroup.fetchGrades);
    testActionHook(
      hookKeys.useFetchGradesIfAssignmentGradeFiltersSet,
      actionGroup.fetchGradesIfAssignmentGradeFiltersSet,
    );
    testActionHook(
      hookKeys.useSubmitImportGradesButtonData,
      actionGroup.submitImportGradesButtonData,
    );
  });
});
