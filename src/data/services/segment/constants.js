import { StrictDict } from 'utils';
import actions from 'data/actions';

export const courseId = window.location.pathname.slice(1);

export const events = StrictDict({
  receivedRoles: 'receivedRoles',
  receivedGrades: 'receivedGrades',
  updateSucceeded: 'updateSucceeded',
  updateFailed: 'updateFailed',
  uploadOverrideSucceeded: 'uploadOverrideSucceeded',
  uploadOverrideFailed: 'uploadOverrideFailed',
  filterApplied: 'filterApplied',
  gradesReportDownloaded: 'gradesReportDownloaded',
  interventionReportDownloaded: 'interventionReportDownloaded',
});

export const eventNames = StrictDict({
  [events.receivedGrades]: 'edx.gradebook.grades.displayed',
  [events.updateSucceeded]: 'edx.gradebook.grades.grade_override.succeeded',
  [events.updateFailed]: 'edx.gradebook.grades.grade_override.failed',
  [events.uploadOverrideSucceeded]: 'edx.gradebook.grades.upload.grades_overrides.succeeded',
  [events.uploadOverrideFailed]: 'edx.gradebook.grades.upload.grades_overrides.failed',
  [events.filterApplied]: 'edx.gradebook.grades.filter_applied',
  [events.gradesReportDownloaded]: 'edx.gradebook.reports.grade_export.downloaded',
  [events.interventionReportDownloaded]: 'edx.gradebook.reports.intervention.downloaded',
});

export const triggers = StrictDict({
  [events.receivedRoles]: actions.roles.fetching.received.toString(),
  [events.receivedGrades]: actions.grades.fetching.received.toString(),
  [events.updateSucceeded]: actions.grades.update.success.toString(),
  [events.updateFailed]: actions.grades.update.failure.toString(),
  [events.uploadOverrideSucceeded]: actions.grades.uploadOverride.success.toString(),
  [events.uploadOverrideFailed]: actions.grades.uploadOverride.failure.toString(),
  [events.filterApplied]: actions.filters.update.courseGradeLimits.toString(),
  [events.gradesReportDownloaded]: actions.grades.downloadReport.bulkGrades.toString(),
  [events.interventionReportDownloaded]: actions.grades.downloadReport.intervention.toString(),
});

export const trackingCategory = 'gradebook';

export const pageViewEvent = { category: trackingCategory, page: courseId };
