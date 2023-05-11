import { StrictDict } from 'utils';
import actions from 'data/actions';
import { actionHook } from './utils';

const app = StrictDict({
  useSetLocalFilter: actionHook(actions.app.setLocalFilter),
  useSetSearchValue: actionHook(actions.app.setSearchValue),
  useSetShowImportSuccessToast: actionHook(actions.app.setShowImportSuccessToast),
  useSetView: actionHook(actions.app.setView),
  useCloseModal: actionHook(actions.app.closeModal),
  useSetModalState: actionHook(actions.app.setModalState),
});

const filters = StrictDict({
  useUpdateAssignment: actionHook(actions.filters.update.assignment),
  useUpdateAssignmentLimits: actionHook(actions.filters.update.assignmentLimits),
  useUpdateAssignmentType: actionHook(actions.filters.update.assignmentType),
  useUpdateCohort: actionHook(actions.filters.update.cohort),
  useUpdateCourseGradeLimits: actionHook(actions.filters.update.courseGradeLimits),
  useUpdateIncludeCourseRoleMembers: actionHook(actions.filters.update.includeCourseRoleMembers),
  useUpdateTrack: actionHook(actions.filters.update.track),
  useResetFilters: actionHook(actions.filters.reset),
});

const grades = StrictDict({
  useDoneViewingAssignment: actionHook(actions.grades.doneViewingAssignment),
  useDownloadBulkGradesReport: actionHook(actions.grades.downloadReport.bulkGrades),
  useDownloadInterventionReport: actionHook(actions.grades.downloadReport.intervention),
  useToggleGradeFormat: actionHook(actions.grades.toggleGradeFormat),
  useCloseBanner: actionHook(actions.grades.banner.close),
});

export default StrictDict({
  app,
  filters,
  grades,
});
