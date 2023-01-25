import thunkActions from 'data/thunkActions';
import { actionHook } from './utils';
import thunkActionHooks from './thunkActions';

jest.mock('data/thunkActions', () => ({
  grades: {
    fetchGradesIfAssignmentGradeFiltersSet: jest.fn(),
  },
}));

jest.mock('./utils', () => ({
  actionHook: (action) => ({ actionHook: action }),
}));

let hooks;

describe('thunkAction hooks', () => {
  describe('grades', () => {
    hooks = thunkActionHooks.grades;
    test('useFetchGradesIfAssignmentGradeFiltersSet', () => {
      expect(hooks.useFetchGradesIfAssignmentGradeFiltersSet)
        .toEqual(actionHook(thunkActions.grades.fetchGradesIfAssignmentGradeFiltersSet));
    });
  });
});
