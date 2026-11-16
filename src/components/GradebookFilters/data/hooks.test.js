import { renderHook } from '@testing-library/react';

import { useFilters } from '@src/data/filtersContext';
import {
  useAreAssignmentGradeFiltersValid,
  useAreCourseGradeFiltersValid,
  useAssignmentGradeFilterValidity,
  useCourseGradeFilterValidity,
} from './hooks';

jest.mock('@src/data/filtersContext', () => ({
  ...jest.requireActual('@src/data/filtersContext'),
  useFilters: jest.fn(),
}));

const renderWithFilters = (hook, filters) => {
  useFilters.mockReturnValue(filters);
  return renderHook(hook).result.current;
};

describe('GradebookFilters data hooks', () => {
  describe.each([
    ['useAssignmentGradeFilterValidity (no upper bound)', useAssignmentGradeFilterValidity, 'assignmentGradeMin', 'assignmentGradeMax', [
      ['0', '100', true, true, true],
      ['110', '5000', true, true, true],
      ['80', '80', true, true, true],
      ['-1', '100', false, true, true],
      ['0', '-1', true, false, true],
      ['', '', false, false, true],
      ['80', '10', true, true, false],
      ['-0.5', '100', false, true, true],
      ['50.9', '50.1', true, true, false],
      ['1e3', '100', true, true, false],
    ]],
    ['useCourseGradeFilterValidity (0 to 100, inclusive)', useCourseGradeFilterValidity, 'courseGradeMin', 'courseGradeMax', [
      ['0', '100', true, true, true],
      ['0', '-1', true, false, true],
      ['-1', '0', false, true, true],
      ['101', '100', false, true, true],
      ['100', '101', true, false, true],
      ['', '', false, false, true],
      ['80', '10', true, true, false],
      ['100.5', '100', false, true, true],
      ['0.5', '99.5', true, true, true],
    ]],
  ])('%s', (_, hook, minKey, maxKey, cases) => {
    it.each(cases)('for min %p and max %p returns isMinValid %p, isMaxValid %p, isRangeValid %p', (min, max, isMinValid, isMaxValid, isRangeValid) => {
      expect(renderWithFilters(hook, { [minKey]: min, [maxKey]: max }))
        .toEqual({ isMinValid, isMaxValid, isRangeValid });
    });
  });

  describe.each([
    ['useAreAssignmentGradeFiltersValid', useAreAssignmentGradeFiltersValid, 'assignmentGradeMin', 'assignmentGradeMax'],
    ['useAreCourseGradeFiltersValid', useAreCourseGradeFiltersValid, 'courseGradeMin', 'courseGradeMax'],
  ])('%s', (_, hook, minKey, maxKey) => {
    it.each([
      ['0', '100', true],
      ['-1', '100', false],
      ['0', '', false],
      ['80', '10', false],
    ])('for min %p and max %p returns %p', (min, max, expected) => {
      expect(renderWithFilters(hook, { [minKey]: min, [maxKey]: max })).toBe(expected);
    });
  });
});
