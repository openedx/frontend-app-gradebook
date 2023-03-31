import { StrictDict } from 'utils';
import actions from 'data/actions';
import { actionHook } from './utils';

const app = StrictDict({
  useSetLocalFilter: actionHook(actions.app.setLocalFilter),
  useSetView: actionHook(actions.app.setView),
});

const filters = StrictDict({
  useUpdateAssignment: actionHook(actions.filters.update.assignment),
  useUpdateAssignmentLimits: actionHook(actions.filters.update.assignmentLimits),
  useUpdateAssignmentType: actionHook(actions.filters.update.assignmentType),
  useUpdateCohort: actionHook(actions.filters.update.cohort),
  useUpdateCourseGradeLimits: actionHook(actions.filters.update.courseGradeLimits),
  useUpdateIncludeCourseRoleMembers: actionHook(actions.filters.update.includeCourseRoleMembers),
  useUpdateTrack: actionHook(actions.filters.update.track),
});

export default StrictDict({
  app,
  filters,
});
