import { renderHook, act } from '@testing-library/react';

import { useFilters } from '@src/data/filtersContext';
import { useRefetchGrades } from '@src/components/GradesView/data/hooks';
import { trackFilterApplied } from '@src/data/services/segment/events';
import { useAreCourseGradeFiltersValid } from '../data/hooks';
import useCourseGradeFilterData from './hooks';

jest.mock('@src/data/filtersContext', () => ({
  ...jest.requireActual('@src/data/filtersContext'),
  useFilters: jest.fn(),
}));
jest.mock('@src/components/GradesView/data/hooks', () => ({
  ...jest.requireActual('@src/components/GradesView/data/hooks'),
  useRefetchGrades: jest.fn(),
}));
jest.mock('@src/data/services/segment/events', () => ({
  ...jest.requireActual('@src/data/services/segment/events'),
  trackFilterApplied: jest.fn(),
}));
jest.mock('../data/hooks', () => ({
  ...jest.requireActual('../data/hooks'),
  useAreCourseGradeFiltersValid: jest.fn(),
}));

const primeMocks = ({
  courseGradeMin = '30',
  courseGradeMax = '90',
  areValid = true,
} = {}) => {
  const setCourseGradeMin = jest.fn();
  const setCourseGradeMax = jest.fn();
  const applyCourseGradeLimits = jest.fn();
  const fetchGrades = jest.fn();
  useFilters.mockReturnValue({
    courseGradeMin,
    courseGradeMax,
    setCourseGradeMin,
    setCourseGradeMax,
    applyCourseGradeLimits,
  });
  useRefetchGrades.mockReturnValue(fetchGrades);
  useAreCourseGradeFiltersValid.mockReturnValue(areValid);
  return {
    setCourseGradeMin, setCourseGradeMax, applyCourseGradeLimits, fetchGrades,
  };
};

const updateQueryParams = jest.fn();

describe('useCourseGradeFilterData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('marks the apply button as disabled when the filters are invalid', () => {
    primeMocks({ areValid: false });
    const { result } = renderHook(() => useCourseGradeFilterData({ updateQueryParams }));
    expect(result.current.isDisabled).toBe(true);
  });

  it('marks the apply button as enabled when the filters are valid', () => {
    primeMocks({ areValid: true });
    const { result } = renderHook(() => useCourseGradeFilterData({ updateQueryParams }));
    expect(result.current.isDisabled).toBe(false);
  });

  it('forwards the current min/max grade values', () => {
    primeMocks({ courseGradeMin: '10', courseGradeMax: '95' });
    const { result } = renderHook(() => useCourseGradeFilterData({ updateQueryParams }));
    expect(result.current.min.value).toBe('10');
    expect(result.current.max.value).toBe('95');
  });

  it('updates min through the filters context on change', () => {
    const { setCourseGradeMin } = primeMocks();
    const { result } = renderHook(() => useCourseGradeFilterData({ updateQueryParams }));
    act(() => {
      result.current.min.onChange({ target: { value: '55' } });
    });
    expect(setCourseGradeMin).toHaveBeenCalledWith('55');
  });

  it('updates max through the filters context on change', () => {
    const { setCourseGradeMax } = primeMocks();
    const { result } = renderHook(() => useCourseGradeFilterData({ updateQueryParams }));
    act(() => {
      result.current.max.onChange({ target: { value: '80' } });
    });
    expect(setCourseGradeMax).toHaveBeenCalledWith('80');
  });

  it('applies limits, tracks the event, fetches grades, and updates query on apply click', () => {
    const { applyCourseGradeLimits, fetchGrades } = primeMocks({
      courseGradeMin: '20',
      courseGradeMax: '80',
    });
    const { result } = renderHook(() => useCourseGradeFilterData({ updateQueryParams }));
    act(() => {
      result.current.handleApplyClick();
    });
    const expected = { courseGradeMin: '20', courseGradeMax: '80' };
    expect(applyCourseGradeLimits).toHaveBeenCalledWith(expected);
    expect(trackFilterApplied).toHaveBeenCalledWith(expected);
    expect(fetchGrades).toHaveBeenCalled();
    expect(updateQueryParams).toHaveBeenCalledWith(expected);
  });
});
