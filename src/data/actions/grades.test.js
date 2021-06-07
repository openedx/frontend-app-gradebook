import actions, { dataKey } from './grades';
import { testAction, testActionTypes } from './testUtils';

describe('actions.grades', () => {
  describe('action types', () => {
    const actionTypes = [
      actions.banner.open,
      actions.banner.close,
      actions.bulkHistory.received,
      actions.bulkHistory.error,
      actions.csvUpload.started,
      actions.csvUpload.finished,
      actions.csvUpload.error,
      actions.doneViewingAssignment,
      actions.downloadReport.bulkGrades,
      actions.downloadReport.intervention,
      actions.fetching.started,
      actions.fetching.finished,
      actions.fetching.error,
      actions.fetching.received,
      actions.overrideHistory.error,
      actions.overrideHistory.received,
      actions.toggleGradeFormat,
      actions.update.request,
      actions.update.success,
      actions.update.failure,
      actions.uploadOverride.success,
      actions.uploadOverride.failure,
    ].map(action => action.toString());
    testActionTypes(actionTypes, dataKey);
  });
  describe('actions provided', () => {
    describe('banner', () => {
      test('open action', () => testAction(actions.banner.open));
      test('close action', () => testAction(actions.banner.close));
    });
    describe('bulkHistory', () => {
      test('received action', () => testAction(actions.bulkHistory.received));
      test('error action', () => testAction(actions.bulkHistory.error));
    });
    describe('csvUpload', () => {
      test('started action', () => testAction(actions.csvUpload.started));
      test('finished action', () => testAction(actions.csvUpload.finished));
      test('error action', () => testAction(actions.csvUpload.error));
    });
    test('doneViewingAssignment', () => testAction(actions.doneViewingAssignment));
    describe('downloadReport', () => {
      test('bulkGrades action', () => testAction(actions.downloadReport.bulkGrades));
      test('intervention action', () => testAction(actions.downloadReport.intervention));
    });
    describe('fetching', () => {
      test('started action', () => testAction(actions.fetching.started));
      test('finished action', () => testAction(actions.fetching.finished));
      test('error action', () => testAction(actions.fetching.error));
      describe('received', () => {
        it('loads grades data from data', () => {
          const data = {
            grades: ['some', 'grades'],
            cohort: 2,
            track: 'summoners',
            assignmentType: 'potion',
            headings: ['H', 'E', 'a', 'd', 'Ing', 'sssss'],
            prev: 'prEEEV',
            next: 'NEEEExt',
            courseId: 'fake ID',
            totalUsersCount: 2,
            filteredUsersCount: 999,
          };
          testAction(actions.fetching.received, { ...data, other: 'fields' }, data);
        });
      });
    });
    describe('overrideHistory', () => {
      test('error action', () => testAction(actions.overrideHistory.error));
      describe('received', () => {
        it('loads override history from data', () => {
          const data = {
            overrideHistory: 'some History',
            currentEarnedAllOverride: 123,
            currentPossibleAllOverride: 243,
            currentEarnedGradedOverride: 1236,
            currentPossibleGradedOverride: 52,
            originalGradeEarnedAll: 323,
            originalGradePossibleAll: 6223,
            originalGradeEarnedGraded: 1232,
            originalGradePossibleGraded: 512,
          };
          testAction(actions.overrideHistory.received, { ...data, other: 'fields' }, data);
        });
      });
    });
    test('toggleGradeFormat', () => testAction(actions.toggleGradeFormat));
    describe('update', () => {
      const courseId = 'fake ID';
      const error = 'Try Again??';
      test('request action', () => testAction(actions.update.request));
      test('success action', () => testAction(actions.update.success));
      test('failure action', () => testAction(
        actions.update.failure,
        [courseId, error],
        { courseId, error },
      ));
    });
    describe('uploadOverride', () => {
      test('success action', () => testAction(actions.uploadOverride.success));
      test('failure action', () => testAction(actions.uploadOverride.failure));
    });
  });
});
