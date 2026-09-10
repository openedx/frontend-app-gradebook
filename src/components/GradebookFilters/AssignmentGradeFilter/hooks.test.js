import { renderHook, act } from '@testing-library/react';

import { useFilters } from '@src/data/filtersContext';
import {
  useRefetchGrades,
  useSelectedAssignmentLabel,
} from '@src/components/GradesView/data/hooks';
import useAssignmentGradeFilterData from './hooks';

jest.mock('@src/data/filtersContext', () => ({
  ...jest.requireActual('@src/data/filtersContext'),
  useFilters: jest.fn(),
}));
jest.mock('@src/components/GradesView/data/hooks', () => ({
  ...jest.requireActual('@src/components/GradesView/data/hooks'),
  useRefetchGrades: jest.fn(),
  useSelectedAssignmentLabel: jest.fn(),
}));

const primeMocks = ({
  assignmentGradeMin = '10',
  assignmentGradeMax = '90',
  selectedAssignment = 'test-label',
} = {}) => {
  const setAssignmentGradeMin = jest.fn();
  const setAssignmentGradeMax = jest.fn();
  const applyAssignmentGradeLimits = jest.fn();
  const fetchGrades = jest.fn();
  useFilters.mockReturnValue({
    assignmentGradeMin,
    assignmentGradeMax,
    setAssignmentGradeMin,
    setAssignmentGradeMax,
    applyAssignmentGradeLimits,
  });
  useRefetchGrades.mockReturnValue(fetchGrades);
  useSelectedAssignmentLabel.mockReturnValue(selectedAssignment);
  return {
    setAssignmentGradeMin, setAssignmentGradeMax, applyAssignmentGradeLimits, fetchGrades,
  };
};

const updateQueryParams = jest.fn();

describe('useAssignmentGradeFilterData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('exposes the current min/max limits and the selected assignment label', () => {
    primeMocks({ assignmentGradeMin: '20', assignmentGradeMax: '80', selectedAssignment: 'the label' });
    const { result } = renderHook(() => useAssignmentGradeFilterData({ updateQueryParams }));
    expect(result.current.assignmentGradeMin).toBe('20');
    expect(result.current.assignmentGradeMax).toBe('80');
    expect(result.current.selectedAssignment).toBe('the label');
  });

  it('updates min through the filters context on change', () => {
    const { setAssignmentGradeMin } = primeMocks();
    const { result } = renderHook(() => useAssignmentGradeFilterData({ updateQueryParams }));
    act(() => {
      result.current.handleSetMin({ target: { value: '42' } });
    });
    expect(setAssignmentGradeMin).toHaveBeenCalledWith('42');
  });

  it('updates max through the filters context on change', () => {
    const { setAssignmentGradeMax } = primeMocks();
    const { result } = renderHook(() => useAssignmentGradeFilterData({ updateQueryParams }));
    act(() => {
      result.current.handleSetMax({ target: { value: '77' } });
    });
    expect(setAssignmentGradeMax).toHaveBeenCalledWith('77');
  });

  it('applies limits, fetches grades, and updates query on submit', () => {
    const { applyAssignmentGradeLimits, fetchGrades } = primeMocks({
      assignmentGradeMin: '25',
      assignmentGradeMax: '95',
    });
    const { result } = renderHook(() => useAssignmentGradeFilterData({ updateQueryParams }));
    act(() => {
      result.current.handleSubmit();
    });
    const expected = { assignmentGradeMin: '25', assignmentGradeMax: '95' };
    expect(applyAssignmentGradeLimits).toHaveBeenCalledWith(expected);
    expect(fetchGrades).toHaveBeenCalled();
    expect(updateQueryParams).toHaveBeenCalledWith(expected);
  });
});
