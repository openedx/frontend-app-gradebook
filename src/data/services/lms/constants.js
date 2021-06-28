import { StrictDict } from 'utils';

export const pageSize = 25;
export const historyRecordLimit = 5;

export const paramKeys = StrictDict({
  cohortId: 'cohort_id',
  pageSize: 'page_size',
  userContains: 'user_contains',
  enrollmentMode: 'enrollment_mode',
  assignment: 'assignment',
  assignmentGradeMin: 'assignmentGradeMin',
  assignmentGradeMax: 'assignmentGradeMax',
  courseGradeMin: 'courseGradeMin',
  courseGradeMax: 'courseGradeMax',
  excludedCourseRoles: 'excluded_course_roles',
});
