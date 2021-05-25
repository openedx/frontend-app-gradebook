import { StrictDict } from 'utils';
import initialFilters from '../constants/filters';
import { createActionFactory } from './utils';

export const dataKey = 'filters';
const createAction = createActionFactory(dataKey);

const initialize = createAction('initialize', ({
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

const reset = createAction('reset');
const update = StrictDict({
  assignment: createAction('update/assignment'),
  assignmentType: createAction('update/assignmentType'),
  assignmentLimits: createAction('update/assignmentLimits'),
  courseGradeLimits: createAction('update/courseGradeLimits'),
  includeCourseRoleMembers: createAction('update/includeCourseRoleMembers'),
});

export default StrictDict({
  initialize,
  reset,
  update: StrictDict(update),
});
