import { keyStore } from 'utils';
import { useSelector } from 'react-redux';
import selectors from 'data/selectors';
import selectorHooks from './selectors';

jest.mock('react-redux', () => ({
  useSelector: (selector) => ({ useSelector: selector }),
}));

jest.mock('data/selectors', () => ({
  filters: {
    allFilters: jest.fn(),
    selectableAssignmentLabels: jest.fn(),
    selectedAssignmentLabel: jest.fn(),
    selectedAssignmentType: jest.fn(),
  },
}));

let hooks;
let hookKeys;
describe('selector hooks', () => {
  describe('filters', () => {
    hooks = selectorHooks.filters;
    hookKeys = keyStore(hooks);
    const testFilterSelector = (hookKey, selector) => {
      test(hookKey, () => {
        expect(hooks[hookKey]()).toEqual(useSelector(selector));
      });
    };
    testFilterSelector(hookKeys.useData, selectors.filters.allFilters);
    testFilterSelector(
      hookKeys.useSelectableAssignmentLabels,
      selectors.filters.selectableAssignmentLabels,
    );
    testFilterSelector(
      hookKeys.useSelectedAssignmentLabel,
      selectors.filters.selectedAssignmentLabel,
    );
    testFilterSelector(
      hookKeys.useSelectedAssignmentType,
      selectors.filters.selectedAssignmentType,
    );
  });
});
