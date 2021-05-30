import { StrictDict } from 'utils';
import { createActionFactory } from './utils';

export const dataKey = 'grades';
const createAction = createActionFactory(dataKey);

const banner = {
  open: createAction('banner/open'),
  close: createAction('banner/close'),
};

const bulkHistory = {
  /**
   * bulkHistory.received(history)
   * @param {object[]} history - bulkHistory fetch results
   */
  received: createAction('bulkHistory/received'),
  // this doesn't seem to be consumed anywhere at the moment
  error: createAction('bulkHistory/error'),
};

const csvUpload = {
  started: createAction('csvUpload/started'),
  finished: createAction('csvUpload/finished'),
  error: createAction('csvUpload/error'),
};

const doneViewingAssignment = createAction('doneViewingAssignment');

// for segment tracking
const downloadReport = {
  bulkGrades: createAction('downloadReport/bulkGrades'),
  intervention: createAction('downloadReport/intervention'),
};

const fetching = {
  started: createAction('fetching/started'),
  finished: createAction('fetching/finished'),
  error: createAction('fetching/error'),
  // for segment tracking
  received: createAction(
    'fetching/received',
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
  ),
};

const overrideHistory = {
  error: createAction('overrideHistory/errorFetching'),
  received: createAction(
    'overrideHistory/received',
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

const toggleGradeFormat = createAction('toggleGradeFormat');

const update = {
  request: createAction('update/request'),
  success: createAction('update/success'),
  failure: createAction('update/failure', (courseId, error) => ({
    payload: { courseId, error },
  })),
};

const uploadOverride = {
  success: createAction('uploadOverride/success'),
  failure: createAction('uploadOverride/failure'),
};

export default StrictDict({
  banner: StrictDict(banner),
  bulkHistory: StrictDict(bulkHistory),
  csvUpload: StrictDict(csvUpload),
  doneViewingAssignment,
  downloadReport: StrictDict(downloadReport),
  fetching: StrictDict(fetching),
  overrideHistory: StrictDict(overrideHistory),
  toggleGradeFormat,
  update: StrictDict(update),
  uploadOverride: StrictDict(uploadOverride),
});
