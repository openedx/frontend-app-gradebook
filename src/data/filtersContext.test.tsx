import { act, renderHook } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import { filtersSnapshot } from '@src/data/filtersSnapshot';
import { FiltersProvider, useFilters } from './filtersContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <FiltersProvider>{children}</FiltersProvider>
  </BrowserRouter>
);

const setup = () => renderHook(() => useFilters(), { wrapper });

describe('FiltersProvider / useFilters', () => {
  it('throws when used outside a FiltersProvider', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useFilters())).toThrow(
      /must be used within a FiltersProvider/,
    );
    spy.mockRestore();
  });

  it('seeds initial values from the filter defaults', () => {
    const { result } = setup();
    expect(result.current).toMatchObject({
      assignmentType: '',
      assignment: '',
      includeCourseRoleMembers: false,
      cohort: '',
      track: '',
      assignmentGradeMin: '0',
      assignmentGradeMax: '100',
      courseGradeMin: '0',
      courseGradeMax: '100',
      searchValue: '',
      appliedAssignmentGradeMin: '0',
      appliedAssignmentGradeMax: '100',
      appliedCourseGradeMin: '0',
      appliedCourseGradeMax: '100',
    });
  });

  describe('setters update React state and the sync snapshot', () => {
    it.each([
      ['setAssignmentType', 'assignmentType', 'Homework'],
      ['setAssignment', 'assignment', 'a1'],
      ['setIncludeCourseRoleMembers', 'includeCourseRoleMembers', true],
      ['setCohort', 'cohort', 'cohort-a'],
      ['setTrack', 'track', 'verified'],
      ['setSearchValue', 'searchValue', 'abc'],
    ] as const)('%s updates %s', (setterName, field, value) => {
      const { result } = setup();
      act(() => {
        (result.current[setterName] as (v: unknown) => void)(value);
      });
      expect(result.current[field]).toEqual(value);
      expect(filtersSnapshot[field]).toEqual(value);
    });

    // The grade-limit setters hold live (per-keystroke) input values; the
    // snapshot the grades fetch reads must only ever see APPLIED values.
    it.each([
      ['setAssignmentGradeMin', 'assignmentGradeMin', '10', '0'],
      ['setAssignmentGradeMax', 'assignmentGradeMax', '90', '100'],
      ['setCourseGradeMin', 'courseGradeMin', '25', '0'],
      ['setCourseGradeMax', 'courseGradeMax', '75', '100'],
    ] as const)('%s updates %s in React state only, not the snapshot', (setterName, field, value, snapshotDefault) => {
      const { result } = setup();
      act(() => {
        (result.current[setterName] as (v: string) => void)(value);
      });
      expect(result.current[field]).toEqual(value);
      expect(filtersSnapshot[field]).toEqual(snapshotDefault);
    });
  });

  describe('apply* commit the live values into the applied slots', () => {
    it('applyAssignmentGradeLimits sets applied min/max and commits them to the snapshot', () => {
      const { result } = setup();
      act(() => {
        result.current.applyAssignmentGradeLimits({
          assignmentGradeMin: '15', assignmentGradeMax: '85',
        });
      });
      expect(result.current.appliedAssignmentGradeMin).toBe('15');
      expect(result.current.appliedAssignmentGradeMax).toBe('85');
      expect(filtersSnapshot.assignmentGradeMin).toBe('15');
      expect(filtersSnapshot.assignmentGradeMax).toBe('85');
    });

    it('applyCourseGradeLimits sets applied min/max and commits them to the snapshot', () => {
      const { result } = setup();
      act(() => {
        result.current.applyCourseGradeLimits({
          courseGradeMin: '30', courseGradeMax: '70',
        });
      });
      expect(result.current.appliedCourseGradeMin).toBe('30');
      expect(result.current.appliedCourseGradeMax).toBe('70');
      expect(filtersSnapshot.courseGradeMin).toBe('30');
      expect(filtersSnapshot.courseGradeMax).toBe('70');
    });
  });

  describe('resetFilters', () => {
    it('resets the named single-value filters to their defaults', () => {
      const { result } = setup();
      act(() => {
        result.current.setAssignmentType('Homework');
        result.current.setAssignment('a1');
        result.current.setCohort('cohort-a');
        result.current.setTrack('verified');
        result.current.setIncludeCourseRoleMembers(true);
      });
      act(() => {
        result.current.resetFilters([
          'assignmentType', 'assignment', 'cohort', 'track', 'includeCourseRoleMembers',
        ]);
      });
      expect(result.current).toMatchObject({
        assignmentType: '',
        assignment: '',
        cohort: '',
        track: '',
        includeCourseRoleMembers: false,
      });
    });

    it('resets both live and applied grade-limit values', () => {
      const { result } = setup();
      act(() => {
        result.current.setAssignmentGradeMin('10');
        result.current.setAssignmentGradeMax('90');
        result.current.setCourseGradeMin('25');
        result.current.setCourseGradeMax('75');
        result.current.applyAssignmentGradeLimits({
          assignmentGradeMin: '10', assignmentGradeMax: '90',
        });
        result.current.applyCourseGradeLimits({
          courseGradeMin: '25', courseGradeMax: '75',
        });
      });
      act(() => {
        result.current.resetFilters([
          'assignmentGradeMin', 'assignmentGradeMax', 'courseGradeMin', 'courseGradeMax',
        ]);
      });
      expect(result.current).toMatchObject({
        assignmentGradeMin: '0',
        assignmentGradeMax: '100',
        courseGradeMin: '0',
        courseGradeMax: '100',
        appliedAssignmentGradeMin: '0',
        appliedAssignmentGradeMax: '100',
        appliedCourseGradeMin: '0',
        appliedCourseGradeMax: '100',
      });
      expect(filtersSnapshot).toMatchObject({
        assignmentGradeMin: '0',
        assignmentGradeMax: '100',
        courseGradeMin: '0',
        courseGradeMax: '100',
      });
    });

    it('ignores unknown filter names', () => {
      const { result } = setup();
      act(() => {
        result.current.setAssignmentType('Homework');
      });
      act(() => {
        result.current.resetFilters(['unknown']);
      });
      expect(result.current.assignmentType).toBe('Homework');
    });
  });
});
