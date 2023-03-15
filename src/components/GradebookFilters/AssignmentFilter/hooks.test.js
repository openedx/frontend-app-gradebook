import { selectors, actions, thunkActions } from 'data/redux/hooks';

import useAssignmentFilterData from './hooks';

jest.mock('data/redux/hooks', () => ({
  selectors: {
    filters: {
      useSelectableAssignmentLabels: jest.fn(),
      useSelectedAssignmentLabel: jest.fn(),
    },
  },
  actions: {
    filters: { useUpdateAssignment: jest.fn() },
  },
  thunkActions: {
    grades: { useFetchGradesIfAssignmentGradeFiltersSet: jest.fn() },
  },
}));

let out;
const testKey = 'test-key';
const event = { target: { value: testKey } };
const testId = 'test-id';
const testType = 'test-type';

const testLabel = { label: testKey, id: testId, type: testType };
const selectableAssignmentLabels = [
  { label: 'some' },
  { label: 'test' },
  { label: 'labels' },
  testLabel,
];
const selectedAssignmentLabel = 'test-assignment-label';
selectors.filters.useSelectableAssignmentLabels.mockReturnValue(selectableAssignmentLabels);
selectors.filters.useSelectedAssignmentLabel.mockReturnValue(selectedAssignmentLabel);

const updateAssignment = jest.fn();
const fetch = jest.fn();
actions.filters.useUpdateAssignment.mockReturnValue(updateAssignment);
thunkActions.grades.useFetchGradesIfAssignmentGradeFiltersSet.mockReturnValue(fetch);

const updateQueryParams = jest.fn();

describe('useAssignmentFilterData hook', () => {
  beforeEach(() => {
    out = useAssignmentFilterData({ updateQueryParams });
  });
  describe('behavior', () => {
    it('initializes redux hooks', () => {
      expect(selectors.filters.useSelectableAssignmentLabels).toHaveBeenCalledWith();
      expect(selectors.filters.useSelectedAssignmentLabel).toHaveBeenCalledWith();
      expect(actions.filters.useUpdateAssignment).toHaveBeenCalledWith();
      expect(thunkActions.grades.useFetchGradesIfAssignmentGradeFiltersSet)
        .toHaveBeenCalledWith();
    });
  });
  describe('output', () => {
    describe('handleEvent', () => {
      beforeEach(() => {
        out.handleChange(event);
      });
      it('updates assignment filter with selected filter', () => {
        expect(updateAssignment).toHaveBeenCalledWith(testLabel);
      });
      it('updates queryParams', () => {
        expect(updateQueryParams).toHaveBeenCalledWith({ assignment: testId });
      });
      it('updates assignment filter with only label if no match', () => {
        out.handleChange({ target: { value: 'no-match' } });
        expect(updateAssignment).toHaveBeenCalledWith({ label: 'no-match' });
      });
      it('calls conditional fetch', () => {
        expect(fetch).toHaveBeenCalled();
      });
    });
    it('passes selectedAssignmentLabel from hook', () => {
      expect(out.selectedAssignmentLabel).toEqual(selectedAssignmentLabel);
    });
    test('selectedAssignmentLabel is empty string if not set', () => {
      selectors.filters.useSelectedAssignmentLabel.mockReturnValue(undefined);
      out = useAssignmentFilterData({ updateQueryParams });
      expect(out.selectedAssignmentLabel).toEqual('');
    });
    it('passes assignmentFilterOptions from hook', () => {
      expect(out.assignmentFilterOptions).toEqual(selectableAssignmentLabels);
    });
  });
});
