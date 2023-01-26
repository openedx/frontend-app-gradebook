import { keyStore } from 'utils';
import thunkActions from 'data/thunkActions';
import { actionHook } from './utils';
import thunkActionHooks from './thunkActions';

jest.mock('data/thunkActions', () => ({
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
  describe('grades', () => {
    const hookKeys = keyStore(thunkActionHooks.grades);
    beforeEach(() => { hooks = thunkActionHooks.grades; });
    testActionHook(hookKeys.useFetchGrades, thunkActions.grades.fetchGrades);
    testActionHook(
      hookKeys.useFetchGradesIfAssignmentGradeFiltersSet,
      thunkActions.grades.fetchGradesIfAssignmentGradeFiltersSet,
    );
    testActionHook(
      hookKeys.useSubmitImportGradesButtonData,
      thunkActions.grades.submitImportGradesButtonData,
    );
  });
});
