import assignmentTypes from './assignmentTypes';
import cohorts from './cohorts';
import filters from './filters';
import grades from './grades';
import roles from './roles';
import special from './special';
import tracks from './tracks';

import LmsApiService from 'data/services/LmsApiService';

const lmsApiServiceArgs = (state) => ({
  cohort: cohorts.getCohortNameById(state, filters.cohort(state)),
  assignment: filters.selectedAssignmentId(state),
  assignmentType: filters.assignmentType(state),
  assignmentGradeMin: grades.formatMinAssignmentGrade(
    filters.assignmentGradeMin(state),
    { assignmentId: filters.selectedAssignmentId(state) },
  ),
  assignmentGradeMax: grades.formatMaxAssignmentGrade(
    filters.assignmentGradeMax(state),
    { assignmentId: filters.selectedAssignmentId(state) },
  ),
  courseGradeMin: grades.formatMinCourseGrade(filters.courseGradeMin(state)),
  courseGradeMax: grades.formatMaxCourseGrade(filters.courseGradeMax(state)),
});


const gradeExportUrl = (state, { courseId }) => (
  LmsApiService.getGradeExportCsvUrl(courseId, {
    ...lmsApiServiceArgs(state),
    excludeCourseRoles: filters.includeCourseRoleMembers(state) ? '' : 'all',
  })
);

const interventionExportUrl = (state, { courseId }) => (
  LmsApiService.getInterventionExportCsvUrl(
    courseId,
    lmsApiServiceArgs(state),
  )
);

const showBulkManagement = (state, { courseId }) => (
  special.hasSpecialBulkManagementAccess(courseId)
  || (tracks.stateHasMastersTrack(state) && state.config.bulkManagementAvailable)
);

const shouldShowSpinner = (state) => {
  const canView = roles.canUserViewGradebook(state);
  return canView === true 
    ? grades.showSpinner(state) 
    : (canView === false ? false : true);
};

const getHeadings = (state) => {
  return grades.headingMapper(
    filters.assignmentType(state) || 'All',
    filters.selectedAssignmentLabel(state) || 'All',
  )(grades.getExampleSectionBreakdown(state))
};

export default {
  root: {
    getHeadings,
    gradeExportUrl,
    interventionExportUrl,
    showBulkManagement,
    shouldShowSpinner,
  },
  assignmentTypes,
  cohorts,
  filters,
  grades,
  roles,
  special,
  tracks,
};
