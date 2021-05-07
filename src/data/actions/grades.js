import { createAction } from '@reduxjs/toolkit';

const csvUpload = {
  started: createAction('grades/csvUpload/started'),
  finished: createAction('grades/csvUpload/finished'),
  error: createAction('grades/csvUpload/error'),
};
const bulkHistory = {
  received: createAction('grades/bulkHistory/received'),
  error: createAction('grades/bulkHistory/error'),
};
const fetching = {
  started: createAction('grades/fetching/started'),
  finished: createAction('grades/fetching/finished'),
  error: createAction('grades/fetching/error'),
};
const overrideHistory = {
  errorFetching: createAction('grades/overrideHistory/errorFetching'),
  received: createAction(
    'grades/overrideHistory/received',
    (data) => ({
      payload: {
        overrideHistory: data.overrideHistory,
        currentEarnedAllOverride: data.currentEarnedAllOverride,
        currentPossibleAllOverride: data.currentPossibleAllOverride,
        currentEarnedGradedOverride: data.currentEarnedGradedOverride,
        currentPossibleGradedOverride: data.currentPossibleGradedOverride,
        originalGradeEarnedAll: data.originalGradeEarnedAll,
        originalGradePossibleAll: data.originalGradePossibleAll,
        originalGradeEarnedGraded: data.originalGradeEarnedGraded,
        originalGradePossibleGraded: data.originalGradePossibleGraded,
      },
    }),
  ),
};

const received = createAction(
  'grades/received',
  (data) => ({
    payload: {
      grades: data.grades,
      cohort: data.cohort,
      track: data.track,
      assignmentType: data.assignmentType,
      headings: data.headings,
      prev: data.prev,
      next: data.next,
      courseId: data.courseId,
      totalUsersCount: data.totalUsersCount,
      filteredUsersCount: data.filteredUsersCount,
    },
  }),
);

const update = {
  request: createAction('grades/update/request'),
  success: createAction('grades/update/success'),
  failure: createAction('grades/update/failure', (courseId, error) => ({
    payload: { courseId, error },
  })),
};

const uploadOverride = {
  success: createAction('grades/uploadOverride/success'),
  failure: createAction('grades/uploadOverride/failure', (courseId, error) => ({
    payload: { courseId, error },
  })),
};

// These actions for google analytics only. Doesn't change redux state.
const downloadReport = {
  bulkGrades: createAction('grades/downloadReport/bulkGrades'),
  intervention: createAction('grades/downloadReport/intervention'),
};

const toggleGradeFormat = createAction('grades/toggleGradeFormat');

const banner = {
  open: createAction('grades/banner/open'),
  close: createAction('grades/banner/close'),
};

const doneViewingAssignment = createAction('grades/doneViewingAssignment');

export {
  banner,
  bulkHistory,
  csvUpload,
  doneViewingAssignment,
  downloadReport,
  fetching,
  overrideHistory,
  received,
  toggleGradeFormat,
  update,
  uploadOverride,
};
