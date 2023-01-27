import { keyStore } from 'utils';
import { useSelector } from 'react-redux';
import selectors from 'data/selectors';
import selectorHooks from './selectors';

jest.mock('react-redux', () => ({
  useSelector: (selector) => ({ useSelector: selector }),
}));

jest.mock('data/selectors', () => ({
  app: {
    assignmentGradeLimits: jest.fn(),
  },
  filters: {
    allFilters: jest.fn(),
    selectableAssignmentLabels: jest.fn(),
    selectedAssignmentLabel: jest.fn(),
    selectedAssignmentType: jest.fn(),
  },
}));

let hooks;
const testSelectorHook = (hookKey, selector) => {
  test(hookKey, () => {
    expect(hooks[hookKey]()).toEqual(useSelector(selector));
  });
};
describe('selector hooks', () => {
  describe('app', () => {
    const hookKeys = keyStore(selectorHooks.app);
    beforeEach(() => { hooks = selectorHooks.app; });
    testSelectorHook(hookKeys.useAssignmentGradeLimits, selectors.app.assignmentGradeLimits);
    testSelectorHook(
      hookKeys.useAreCourseGradeFiltersValid,
      selectors.app.areCourseGradeFiltersValid,
    );
    testSelectorHook(hookKeys.useCourseGradeLimits, selectors.app.courseGradeLimits);
  });
  describe('filters', () => {
    const hookKeys = keyStore(selectorHooks.filters);
    beforeEach(() => { hooks = selectorHooks.filters; });
    testSelectorHook(hookKeys.useData, selectors.filters.allFilters);
    testSelectorHook(
      hookKeys.useSelectableAssignmentLabels,
      selectors.filters.selectableAssignmentLabels,
    );
    testSelectorHook(
      hookKeys.useSelectedAssignmentLabel,
      selectors.filters.selectedAssignmentLabel,
    );
    testSelectorHook(
      hookKeys.useSelectedAssignmentType,
      selectors.filters.selectedAssignmentType,
    );
  });
});
