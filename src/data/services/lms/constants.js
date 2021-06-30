import { StrictDict } from 'utils';

export const pageSize = 25;
export const historyRecordLimit = 5;

export const paramKeys = StrictDict({
  cohortId: 'cohort_id',
  pageSize: 'page_size',
  userContains: 'user_contains',
  enrollmentMode: 'enrollment_mode',
  assignment: 'assignment',
  assignmentGradeMin: 'assignment_grade_min',
  assignmentGradeMax: 'assignment_grade_max',
  courseGradeMin: 'course_grade_min',
  courseGradeMax: 'course_grade_max',
  excludedCourseRoles: 'excluded_course_roles',
});
