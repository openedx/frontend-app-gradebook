import { selectors, actions } from '@src/data/redux/hooks';

import useAssignmentTypeFilterData from './hooks';

jest.mock('data/redux/hooks', () => ({
  selectors: {
    assignmentTypes: {
      useAllAssignmentTypes: jest.fn(),
    },
    filters: {
      useSelectableAssignmentLabels: jest.fn(),
      useAssignmentType: jest.fn(),
    },
  },
  actions: {
    filters: { useUpdateAssignmentType: jest.fn() },
  },
}));

let out;
const testId = 'test-id';
const testKey = 'test-key';

const testType = 'test-type';
const allTypes = [testType, 'and', 'some', 'other', 'types'];
selectors.assignmentTypes.useAllAssignmentTypes.mockReturnValue(allTypes);
const event = { target: { value: testType } };

const testLabel = { label: testKey, id: testId, type: testType };
const selectableAssignmentLabels = [
  { label: 'some' },
  { label: 'test' },
  { label: 'labels' },
  testLabel,
];
selectors.filters.useSelectableAssignmentLabels.mockReturnValue(selectableAssignmentLabels);
selectors.filters.useAssignmentType.mockReturnValue(testType);

const updateAssignmentType = jest.fn();
actions.filters.useUpdateAssignmentType.mockReturnValue(updateAssignmentType);

const updateQueryParams = jest.fn();

describe('useAssignmentTypeFilterData hook', () => {
  beforeEach(() => {
    out = useAssignmentTypeFilterData({ updateQueryParams });
  });
  describe('behavior', () => {
    it('initializes redux hooks', () => {
      expect(selectors.assignmentTypes.useAllAssignmentTypes).toHaveBeenCalledWith();
      expect(selectors.filters.useSelectableAssignmentLabels).toHaveBeenCalledWith();
      expect(selectors.filters.useAssignmentType).toHaveBeenCalledWith();
      expect(actions.filters.useUpdateAssignmentType).toHaveBeenCalledWith();
    });
  });
  describe('output', () => {
    describe('handleEvent', () => {
      beforeEach(() => {
        out.handleChange(event);
      });
      it('updates assignmentType filter with selected filter', () => {
        expect(updateAssignmentType).toHaveBeenCalledWith(testType);
      });
      it('updates queryParams', () => {
        expect(updateQueryParams).toHaveBeenCalledWith({ assignmentType: testType });
      });
    });
    describe('selectedAssignmentType', () => {
      it('returns selected assignmentType', () => {
        expect(out.selectedAssignmentType).toEqual(testType);
      });
      it('returns empty string if no assignmentType is selected', () => {
        selectors.filters.useAssignmentType.mockReturnValue(undefined);
        out = useAssignmentTypeFilterData({ updateQueryParams });
        expect(out.selectedAssignmentType).toEqual('');
      });
    });
    it('passes assignmentTypes from hook', () => {
      expect(out.assignmentTypes).toEqual(allTypes);
    });
    test('assignmentTypes is empty object if hook returns undefined', () => {
      selectors.assignmentTypes.useAllAssignmentTypes.mockReturnValue(undefined);
      out = useAssignmentTypeFilterData({ updateQueryParams });
      expect(out.assignmentTypes).toEqual({});
    });
    it('returns isDisabled if assigmentFilterOptions is empty', () => {
      expect(out.isDisabled).toEqual(false);
      selectors.assignmentTypes.useAllAssignmentTypes.mockReturnValue([]);
      out = useAssignmentTypeFilterData({ updateQueryParams });
    });
  });
});
