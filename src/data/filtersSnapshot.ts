import initialFilters from '@src/data/constants/filters';

/**
 * Synchronous mirror of the `FiltersProvider` filter values.
 */

export interface FiltersSnapshot {
  assignmentType: string;
  /** Selected assignment id (the label/type are derived from the query results). */
  assignment: string;
  includeCourseRoleMembers: boolean;
  cohort: string;
  track: string;
  assignmentGradeMin: string;
  assignmentGradeMax: string;
  courseGradeMin: string;
  courseGradeMax: string;
  searchValue: string;
}

export const filtersSnapshot: FiltersSnapshot = {
  assignmentType: initialFilters.assignmentType,
  assignment: initialFilters.assignment,
  includeCourseRoleMembers: initialFilters.includeCourseRoleMembers,
  cohort: initialFilters.cohort,
  track: initialFilters.track,
  assignmentGradeMin: initialFilters.assignmentGradeMin,
  assignmentGradeMax: initialFilters.assignmentGradeMax,
  courseGradeMin: initialFilters.courseGradeMin,
  courseGradeMax: initialFilters.courseGradeMax,
  searchValue: '',
};

export default filtersSnapshot;
