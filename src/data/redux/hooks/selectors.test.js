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
    areCourseGradeFiltersValid: jest.fn(),
    courseGradelimits: jest.fn(),
  },
  assignmentTypes: { allAssignmentTypes: jest.fn() },
  cohorts: {
    allCohorts: jest.fn(),
    cohortsByName: jest.fn(),
  },
  filters: {
    allFilters: jest.fn(),
    includeCourseRoleMembers: jest.fn(),
    selectableAssignmentLabels: jest.fn(),
    selectedAssignmentLabel: jest.fn(),
    assignmentType: jest.fn(),
  },
  tracks: {
    allTracks: jest.fn(),
    tracksByName: jest.fn(),
  },
  root: {
    gradeExportUrl: jest.fn(),
    selectedCohortEntry: jest.fn(),
    selectedTrackEntry: jest.fn(),
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
    beforeEach(() => { hooks = selectorHooks.root; });
    testHook(hookKeys.useGradeExportUrl, selectors.root.gradeExportUrl);
    testHook(hookKeys.useSelectedCohortEntry, selectors.root.selectedCohortEntry);
    testHook(hookKeys.useSelectedTrackEntry, selectors.root.selectedTrackEntry);
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
    testHook(hookKeys.useIncludeCourseRoleMembers, selGroup.includeCourseRoleMembers);
    testHook(hookKeys.useSelectableAssignmentLabels, selGroup.selectableAssignmentLabels);
    testHook(hookKeys.useSelectedAssignmentLabel, selGroup.selectedAssignmentLabel);
    testHook(hookKeys.useAssignmentType, selGroup.assignmentType);
  });
  describe('tracks', () => {
    const hookKeys = keyStore(selectorHooks.tracks);
    const selGroup = selectors.tracks;
    beforeEach(() => { hooks = selectorHooks.tracks; });
    testHook(hookKeys.useAllTracks, selGroup.allTracks);
    testHook(hookKeys.useTracksByName, selGroup.tracksByName);
  });
});
