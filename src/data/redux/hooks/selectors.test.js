import { keyStore } from 'utils';
import { useSelector } from 'react-redux';
import selectors from 'data/selectors';
import selectorHooks from './selectors';

jest.mock('react-redux', () => ({
  useSelector: (selector) => ({ useSelector: selector }),
}));

jest.mock('data/selectors', () => ({
  app: {
    activeView: jest.fn(),
    assignmentGradeLimits: jest.fn(),
    areCourseGradeFiltersValid: jest.fn(),
    courseGradelimits: jest.fn(),
    courseId: jest.fn(),
  },
  assignmentTypes: {
    allAssignmentTypes: jest.fn(),
    areGradesFrozen: jest.fn(),
  },
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
  roles: {
    canUserViewGradebook: jest.fn(),
  },
  tracks: {
    allTracks: jest.fn(),
    tracksByName: jest.fn(),
  },
  root: {
    gradeExportUrl: jest.fn(),
    selectedCohortEntry: jest.fn(),
    selectedTrackEntry: jest.fn(),
    showBulkManagement: jest.fn(),
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
    testHook(hookKeys.useShowBulkManagement, selectors.root.showBulkManagement);
  });
  describe('app', () => {
    const hookKeys = keyStore(selectorHooks.app);
    const selGroup = selectors.app;
    beforeEach(() => { hooks = selectorHooks.app; });
    testHook(hookKeys.useActiveView, selGroup.activeView);
    testHook(hookKeys.useAssignmentGradeLimits, selGroup.assignmentGradeLimits);
    testHook(hookKeys.useAreCourseGradeFiltersValid, selGroup.areCourseGradeFiltersValid);
    testHook(hookKeys.useCourseGradeLimits, selGroup.courseGradeLimits);
    testHook(hookKeys.useCourseId, selGroup.courseId);
  });
  describe('assignmentTypes', () => {
    const hookKeys = keyStore(selectorHooks.assignmentTypes);
    const selGroup = selectors.assignmentTypes;
    beforeEach(() => { hooks = selectorHooks.assignmentTypes; });
    testHook(hookKeys.useAllAssignmentTypes, selGroup.allAssignmentTypes);
    testHook(hookKeys.useAreGradesFrozen, selGroup.areGradesFrozen);
  });
  describe('cohorts', () => {
    const hookKeys = keyStore(selectorHooks.cohorts);
    const selGroup = selectors.cohorts;
    beforeEach(() => { hooks = selectorHooks.cohorts; });
    testHook(hookKeys.useAllCohorts, selGroup.allCohorts);
    testHook(hookKeys.useCohortsByName, selGroup.cohortsByName);
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
  describe('roles', () => {
    const hookKeys = keyStore(selectorHooks.roles);
    const selGroup = selectors.roles;
    beforeEach(() => { hooks = selectorHooks.roles; });
    testHook(hookKeys.useCanUserViewGradebook, selGroup.canUserViewGradebook);
  });
  describe('tracks', () => {
    const hookKeys = keyStore(selectorHooks.tracks);
    const selGroup = selectors.tracks;
    beforeEach(() => { hooks = selectorHooks.tracks; });
    testHook(hookKeys.useAllTracks, selGroup.allTracks);
    testHook(hookKeys.useTracksByName, selGroup.tracksByName);
  });
});
