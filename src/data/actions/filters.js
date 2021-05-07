import { createAction } from '@reduxjs/toolkit';
import { StrictDict } from 'utils';
import initialFilters from '../constants/filters';

const initialize = createAction('filters/initialize', ({
  assignment = initialFilters.assignment,
  assignmentType = initialFilters.assignmentType,
  track = initialFilters.track,
  cohort = initialFilters.cohort,
  assignmentGradeMin = initialFilters.assignmentGradeMin,
  assignmentGradeMax = initialFilters.assignmentGradeMax,
  courseGradeMin = initialFilters.courseGradeMin,
  courseGradeMax = initialFilters.assignmentGradeMax,
  includeCourseRoleMembers = initialFilters.includeCourseRoleMembers,
}) => ({
  payload: {
    assignment: { id: assignment },
    assignmentType,
    track,
    cohort,
    assignmentGradeMin,
    assignmentGradeMax,
    courseGradeMin,
    courseGradeMax,
    includeCourseRoleMembers: Boolean(includeCourseRoleMembers),
  },
}));

const reset = createAction('filters/reset'); // paylaod
const update = StrictDict({
  assignment: createAction('filters/update/assignment'),
  assignmentType: createAction('filters/update/assignmentType'),
  assignmentLimits: createAction('filters/update/assignmentLimits'),
  courseGradeLimits: createAction('filters/update/courseGradeLimits'),
  includeCourseRoleMembers: createAction('filters/update/includeCourseRoleMembers'),
});

export default StrictDict({
  initialize,
  reset,
  update,
});
