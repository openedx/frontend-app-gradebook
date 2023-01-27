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
const testHook = (hookKey, selector) => {
  test(hookKey, () => {
    expect(hooks[hookKey]()).toEqual(useSelector(selector));
  });
};
describe('selector hooks', () => {
  describe('root selectors', () => {
    const hookKeys = keyStore(selectorHooks.root);
    const selGroup = selectors.root;
    beforeEach(() => { hooks = selectorHooks.root; });
    testHook(hookKeys.useGradeExportUrl, selGroup.gradeExportUrl);
    testHook(hookKeys.useSelectedCohortEntry, selGroup.selectedCohortEntry);
    testHook(hookKeys.useSelectedTrackEntry, selGroup.selectedTrackEntry);
  });
  describe('app', () => {
    const hookKeys = keyStore(selectorHooks.app);
    const selGroup = selectors.app;
    beforeEach(() => { hooks = selectorHooks.app; });
    testHook(hookKeys.useAssignmentGradeLimits, selGroup.assignmentGradeLimits);
    testHook(hookKeys.useAreCourseGradeFiltersValid, selGroup.areCourseGradeFiltersValid);
    testHook(hookKeys.useCourseGradeLimits, selGroup.courseGradeLimits);
  });
  describe('assignmentTypes', () => {
    const hookKeys = keyStore(selectorHooks.assignmentTypes);
    const selGroup = selectors.assignmentTypes;
    beforeEach(() => { hooks = selectorHooks.assignmentTypes; });
    testHook(hookKeys.useAllAssignmentTypes, selGroup.allAssignmentTypes);
  });
  describe('filters', () => {
    const hookKeys = keyStore(selectorHooks.filters);
    const selGroup = selectors.filters;
    beforeEach(() => { hooks = selectorHooks.filters; });
    testHook(hookKeys.useData, selGroup.allFilters);
    testHook(hookKeys.useSelectableAssignmentLabels, selGroup.selectableAssignmentLabels);
    testHook(hookKeys.useSelectedAssignmentLabel, selGroup.selectedAssignmentLabel);
    testHook(hookKeys.useSelectedAssignmentType, selGroup.selectedAssignmentType);
  });
  describe('tracks', () => {
    const hookKeys = keyStore(selectorHooks.tracks);
    const selGroup = selectors.tracks;
    beforeEach(() => { hooks = selectorHooks.tracks; });
    testHook(hookKeys.useAllTracks, selGroup.allTracks);
    testHook(hookKeys.useTracksByName, selGroup.tracksByName);
  });
});
