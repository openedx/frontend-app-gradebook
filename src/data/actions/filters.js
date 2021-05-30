import { StrictDict } from 'utils';
import initialFilters from '../constants/filters';
import { createActionFactory } from './utils';

export const dataKey = 'filters';
const createAction = createActionFactory(dataKey);

/**
 * initialize(filterValues)
 * @param {object} - object of filter values. Omitted filters are initialized to default value.
 */
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

/**
 * reset(filterNames)
 * resets a list of filters to initial value
 * @param {stringp[]} - list of filters to reset
 */
const reset = createAction('reset');
const update = StrictDict({
  /**
   * update.assignment(assignment)
   * @param {object} assignment - new assignment filter object ({ id, ... })
   */
  assignment: createAction('update/assignment'),
  /**
   * update.assignmentType(assignmentType)
   * @param {string} assignmentType - new assignmentType filter
   */
  assignmentType: createAction('update/assignmentType'),
  /**
   * update.assignmentLimits(limits)
   * @param {object} limits - object of assignmentLimits
   *   ({ assigmnentGradeMax, assignmentGradeMin })
   */
  assignmentLimits: createAction('update/assignmentLimits'),
  /**
   * update.courseGradeLimits(limits)
   * @param {object} limits - object of courseLimits
   *   ({ courseGradeMax, courseGradeMin })
   */
  courseGradeLimits: createAction('update/courseGradeLimits'),
  /**
   * update.includeCourseRoleMembers(includeCourseRoleMembers)
   * @param {bool} includeCourseRoleMembers - include staff in grades table?
   */
  includeCourseRoleMembers: createAction('update/includeCourseRoleMembers'),
  /**
   * update.cohort(cohortId)
   * @param {number} cohortId - new cohort filter id
   */
  cohort: createAction('update/cohort'),
  /**
   * update.track(trackSlug)
   * @param {string} trackSlug - new track filter slug
   */
  track: createAction('update/track'),
});

export default StrictDict({
  initialize,
  reset,
  update: StrictDict(update),
});
