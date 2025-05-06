import { keyStore } from 'utils';
import { useSelector } from 'react-redux';
import selectors from 'data/selectors';
import selectorHooks from './selectors';

jest.mock('react-redux', () => ({
  useSelector: (selector) => ({ useSelector: selector }),
}));

const testValue = 'test-value';
const testState = { test: 'state value' };

let hookKeys;
let hooks;
let selKeys;
let selectorGroup;

const loadSelectorGroup = (hookGroup, selGroup) => {
  hookKeys = keyStore(hookGroup);
  selKeys = keyStore(selGroup);
  beforeEach(() => {
    hooks = hookGroup;
    selectorGroup = selGroup;
  });
};

const testHook = (hookKey, selectorKey) => {
  test(hookKey, () => {
    expect(hooks[hookKey]()).toEqual(useSelector(selectorGroup[selectorKey]));
  });
};

describe('selector hooks', () => {
  describe('root selectors', () => {
    loadSelectorGroup(selectorHooks.root, selectors.root);
    testHook(hookKeys.useEditModalPossibleGrade, selKeys.editModalPossibleGrade);
    testHook(hookKeys.useGetHeadings, selKeys.getHeadings);
    testHook(hookKeys.useGradeExportUrl, selKeys.gradeExportUrl);
    testHook(hookKeys.useInterventionExportUrl, selKeys.interventionExportUrl);
    testHook(hookKeys.useSelectedCohortEntry, selKeys.selectedCohortEntry);
    testHook(hookKeys.useSelectedTrackEntry, selKeys.selectedTrackEntry);
    testHook(hookKeys.useShouldShowSpinner, selKeys.shouldShowSpinner);
    testHook(hookKeys.useShowBulkManagement, selKeys.showBulkManagement);
    describe(hookKeys.useFilterBadgeConfig, () => {
      test('calls filterBadgeConfig selector with passed filterName', () => {
        const filterBadgeConfig = (state, filterName) => ({
          filterBadgeConfig: { state, filterName },
        });
        const rootKeys = keyStore(selectors.root);
        jest.spyOn(selectors.root, rootKeys.filterBadgeConfig)
          .mockImplementation(filterBadgeConfig);
        const out = hooks.useFilterBadgeConfig(testValue);
        expect(out.useSelector(testState)).toEqual(filterBadgeConfig(testState, testValue));
      });
    });
  });
  describe('app', () => {
    loadSelectorGroup(selectorHooks.app, selectors.app);
    testHook(hookKeys.useActiveView, selKeys.activeView);
    testHook(hookKeys.useAssignmentGradeLimits, selKeys.assignmentGradeLimits);
    testHook(hookKeys.useAreCourseGradeFiltersValid, selKeys.areCourseGradeFiltersValid);
    testHook(hookKeys.useAreAssignmentGradeFiltersValid, selKeys.areAssignmentGradeFiltersValid);
    testHook(hookKeys.useCourseGradeLimits, selKeys.courseGradeLimits);
    testHook(hookKeys.useCourseId, selKeys.courseId);
    testHook(hookKeys.useModalData, selKeys.modalData);
    testHook(hookKeys.useSearchValue, selKeys.searchValue);
    testHook(hookKeys.useShowImportSuccessToast, selKeys.showImportSuccessToast);
  });
  describe('assignmentTypes', () => {
    loadSelectorGroup(selectorHooks.assignmentTypes, selectors.assignmentTypes);
    testHook(hookKeys.useAllAssignmentTypes, selKeys.allAssignmentTypes);
    testHook(hookKeys.useAreGradesFrozen, selKeys.areGradesFrozen);
  });
  describe('cohorts', () => {
    loadSelectorGroup(selectorHooks.cohorts, selectors.cohorts);
    testHook(hookKeys.useAllCohorts, selKeys.allCohorts);
    testHook(hookKeys.useCohortsByName, selKeys.cohortsByName);
  });
  describe('filters', () => {
    loadSelectorGroup(selectorHooks.filters, selectors.filters);
    testHook(hookKeys.useData, selKeys.allFilters);
    testHook(hookKeys.useIncludeCourseRoleMembers, selKeys.includeCourseRoleMembers);
    testHook(hookKeys.useSelectableAssignmentLabels, selKeys.selectableAssignmentLabels);
    testHook(hookKeys.useSelectedAssignmentLabel, selKeys.selectedAssignmentLabel);
    testHook(hookKeys.useAssignmentType, selKeys.assignmentType);
  });
  describe('grades', () => {
    loadSelectorGroup(selectorHooks.grades, selectors.grades);
    testHook(hookKeys.useAllGrades, selKeys.allGrades);
    testHook(hookKeys.useGradeData, selKeys.gradeData);
    testHook(hookKeys.useHasOverrideErrors, selKeys.hasOverrideErrors);
    testHook(hookKeys.useShowSuccess, selKeys.showSuccess);
    test(hookKeys.useUserCounts, () => {
      expect(hooks.useUserCounts()).toEqual({
        filteredUsersCount: useSelector(selectors.grades.filteredUsersCount),
        totalUsersCount: useSelector(selectors.grades.totalUsersCount),
      });
    });
  });
  describe('roles', () => {
    loadSelectorGroup(selectorHooks.roles, selectors.roles);
    testHook(hookKeys.useCanUserViewGradebook, selKeys.canUserViewGradebook);
  });
  describe('tracks', () => {
    loadSelectorGroup(selectorHooks.tracks, selectors.tracks);
    testHook(hookKeys.useAllTracks, selKeys.allTracks);
    testHook(hookKeys.useTracksByName, selKeys.tracksByName);
  });
});
