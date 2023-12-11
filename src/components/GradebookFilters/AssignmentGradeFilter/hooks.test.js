import { selectors, actions, thunkActions } from 'data/redux/hooks';

import useAssignmentGradeFilterData from './hooks';

jest.mock('data/redux/hooks', () => ({
  selectors: {
    app: {
      useAreAssignmentGradeFiltersValid: jest.fn(),
      useAssignmentGradeLimits: jest.fn(),
    },
    filters: { useSelectedAssignmentLabel: jest.fn() },
  },
  actions: {
    app: { useSetLocalFilter: jest.fn() },
    filters: { useUpdateAssignmentLimits: jest.fn() },
  },
  thunkActions: {
    grades: { useFetchGrades: jest.fn() },
  },
}));

let out;

const assignmentGradeLimits = { assignmentGradeMax: 200, assignmentGradeMin: 3 };
const selectedAssignmentLabel = 'test-assignment-label';
const useAreAssignmentGradeFiltersValid = false;
selectors.app.useAssignmentGradeLimits.mockReturnValue(assignmentGradeLimits);
selectors.filters.useSelectedAssignmentLabel.mockReturnValue(selectedAssignmentLabel);

const setLocalFilter = jest.fn();
const updateAssignmentLimits = jest.fn();
const fetch = jest.fn();
actions.app.useSetLocalFilter.mockReturnValue(setLocalFilter);
actions.filters.useUpdateAssignmentLimits.mockReturnValue(updateAssignmentLimits);
thunkActions.grades.useFetchGrades.mockReturnValue(fetch);

const testValue = 42;

const updateQueryParams = jest.fn();

describe('useAssignmentFilterData hook', () => {
  beforeEach(() => {
    out = useAssignmentGradeFilterData({ updateQueryParams });
  });
  describe('behavior', () => {
    it('initializes redux hooks', () => {
      expect(selectors.app.useAreAssignmentGradeFiltersValid).toHaveBeenCalledWith();
      expect(selectors.app.useAssignmentGradeLimits).toHaveBeenCalledWith();
      expect(selectors.filters.useSelectedAssignmentLabel).toHaveBeenCalledWith();
      expect(actions.app.useSetLocalFilter).toHaveBeenCalledWith();
      expect(actions.filters.useUpdateAssignmentLimits).toHaveBeenCalledWith();
      expect(thunkActions.grades.useFetchGrades).toHaveBeenCalledWith();
    });
  });
  describe('output', () => {
    describe('handleSubmit', () => {
      beforeEach(() => {
        out.handleSubmit();
      });
      it('updates assignment limits filter', () => {
        expect(updateAssignmentLimits).toHaveBeenCalledWith(assignmentGradeLimits);
      });
      it('updates queryParams', () => {
        expect(updateQueryParams).toHaveBeenCalledWith(assignmentGradeLimits);
      });
      it('calls conditional fetch', () => {
        expect(fetch).toHaveBeenCalled();
      });
    });
    test('handleSetMax sets assignmentGradeMax', () => {
      out.handleSetMax({ target: { value: testValue } });
      expect(setLocalFilter).toHaveBeenCalledWith({ assignmentGradeMax: testValue });
    });
    test('handleSetMin sets assignmentGradeMin', () => {
      out.handleSetMin({ target: { value: testValue } });
      expect(setLocalFilter).toHaveBeenCalledWith({ assignmentGradeMin: testValue });
    });
    it('passes selectedAssignment from hook', () => {
      expect(out.selectedAssignment).toEqual(selectedAssignmentLabel);
    });
    it('passes assignmentGradeMin and assignmentGradeMax from hook', () => {
      expect(out.assignmentGradeMax).toEqual(assignmentGradeLimits.assignmentGradeMax);
      expect(out.assignmentGradeMin).toEqual(assignmentGradeLimits.assignmentGradeMin);
    });
    it('passes isDisabled from hook', () => {
      expect(out.isDisabled).toEqual(!useAreAssignmentGradeFiltersValid || !selectedAssignmentLabel);
    });
  });
});
