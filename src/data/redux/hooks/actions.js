import { StrictDict } from 'utils';
import actions from 'data/actions';
import { actionHook } from './utils';

const app = StrictDict({
  useSetLocalFilter: actionHook(actions.app.setLocalFilter),
});

const filters = StrictDict({
  useUpdateCohort: actionHook(actions.filters.update.cohort),
  useUpdateTrack: actionHook(actions.filters.update.track),
  useUpdateAssignment: actionHook(actions.filters.update.assignment),
  useUpdateAssignmentLimits: actionHook(actions.filters.update.assignmentLimits),
  useUpdateCourseGradeLimits: actionHook(actions.filters.update.courseGradeLimits),
});

export default StrictDict({
  app,
  filters,
});
