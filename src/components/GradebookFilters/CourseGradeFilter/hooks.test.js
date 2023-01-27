import { selectors, actions, thunkActions } from 'data/redux/hooks';

import useCourseTypeFilterData from './hooks';

jest.mock('data/redux/hooks', () => ({
  selectors: {
    app: {
      useAreCourseGradeFiltersValid: jest.fn(),
      useCourseGradeLimits: jest.fn(),
    },
  },
  actions: {
    app: { useSetLocalFilter: jest.fn() },
    filters: { useUpdateCourseGradeLimits: jest.fn() },
  },
  thunkActions: {
    grades: { useFetchGrades: jest.fn() },
  },
}));

let out;

const courseGradeLimits = { courseGradeMax: 120, courseGradeMin: 32 };
selectors.app.useAreCourseGradeFiltersValid.mockReturnValue(true);
selectors.app.useCourseGradeLimits.mockReturnValue(courseGradeLimits);

const setLocalFilter = jest.fn();
actions.app.useSetLocalFilter.mockReturnValue(setLocalFilter);
const updateCourseGradeLimits = jest.fn();
actions.filters.useUpdateCourseGradeLimits.mockReturnValue(updateCourseGradeLimits);
const fetch = jest.fn();
thunkActions.grades.useFetchGrades.mockReturnValue(fetch);

const testValue = 55;

const updateQueryParams = jest.fn();

describe('useCourseTypeFilterData hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    out = useCourseTypeFilterData({ updateQueryParams });
  });
  describe('behavior', () => {
    it('initializes redux hooks', () => {
      expect(selectors.app.useAreCourseGradeFiltersValid).toHaveBeenCalledWith();
      expect(selectors.app.useCourseGradeLimits).toHaveBeenCalledWith();
      expect(actions.app.useSetLocalFilter).toHaveBeenCalledWith();
      expect(actions.filters.useUpdateCourseGradeLimits).toHaveBeenCalledWith();
      expect(thunkActions.grades.useFetchGrades).toHaveBeenCalledWith();
    });
  });
  describe('output', () => {
    it('returns isDisabled if assigmentFilterOptions is empty', () => {
      expect(out.isDisabled).toEqual(false);
      selectors.app.useAreCourseGradeFiltersValid.mockReturnValue(false);
      out = useCourseTypeFilterData({ updateQueryParams });
      expect(out.isDisabled).toEqual(true);
    });
    test('min value and onChange', () => {
      const { courseGradeMin } = courseGradeLimits;
      expect(out.min.value).toEqual(courseGradeMin);
      out.min.onChange({ target: { value: testValue } });
      expect(setLocalFilter).toHaveBeenCalledWith({ courseGradeMin: testValue });
    });
    test('max value and onChange', () => {
      const { courseGradeMax } = courseGradeLimits;
      expect(out.max.value).toEqual(courseGradeMax);
      out.max.onChange({ target: { value: testValue } });
      expect(setLocalFilter).toHaveBeenCalledWith({ courseGradeMax: testValue });
    });
    it('updates filter, fetches grades, and updates query params on apply click', () => {
      out.handleApplyClick();
      expect(updateCourseGradeLimits).toHaveBeenCalledWith(courseGradeLimits);
      expect(fetch).toHaveBeenCalledWith();
      expect(updateQueryParams).toHaveBeenCalledWith(courseGradeLimits);
    });
  });
});
