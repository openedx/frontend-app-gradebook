import grades, { initialGradesState as initialState } from './grades';
import actions from '../actions/grades';
import filterActions from '../actions/filters';

const headingsData = [
  { name: 'exam' },
  { name: 'homework2' },
];

const testingState = {
  ...initialState,
  bulkManagement: {
    errorMessages: 'some error message',
    uploadSuccess: false,
  },
  arbitraryField: 'abitrary',
};

describe('grades reducer', () => {
  it('has initial state', () => {
    expect(
      grades(undefined, {}),
    ).toEqual(initialState);
  });

  describe('action handlers', () => {
    describe('actions.banner.open', () => {
      it('sets showSuccess to true', () => {
        expect(
          grades(undefined, actions.banner.open()),
        ).toEqual({ ...initialState, showSuccess: true });
      });
    });
    describe('actions.banner.close', () => {
      it('set showSuccess to false', () => {
        expect(
          grades(undefined, actions.banner.close()),
        ).toEqual({ ...initialState, showSuccess: false });
      });
    });

    describe('actions.bulkHistory.received', () => {
      it('loads payload into bulkManagement.history', () => {
        const history = 'HIstory';
        expect(
          grades(testingState, actions.bulkHistory.received(history)),
        ).toEqual({
          ...testingState,
          bulkManagement: { ...testingState.bulkManagement, history },
        });
      });
    });

    describe('actions.csvUpload.started', () => {
      it(
        'sets showSpinner=true and removes errorMessages and uploadSuccess from bulkManagement',
        () => {
          const {
            errorMessages,
            uploadSuccess,
            ...expectedBulkManagement
          } = testingState.bulkManagement;
          expect(
            grades(testingState, actions.csvUpload.started()),
          ).toEqual({
            ...testingState,
            showSpinner: true,
            bulkManagement: expectedBulkManagement,
          });
        },
      );
    });
    describe('handling actions.csvUpload.finished', () => {
      it('sets showSpinner=false and sets bulkManagement.uploadSuccess=true', () => {
        expect(
          grades(testingState, actions.csvUpload.finished()),
        ).toEqual({
          ...testingState,
          showSpinner: false,
          bulkManagement: { ...testingState.bulkManagement, uploadSuccess: true },
        });
      });
    });
    describe('handling actions.csvUpload.error', () => {
      it('loads errorMessage to bulkManagement from payload and sets showSpinner=false', () => {
        const errorMessage = 'This is a new error message';
        expect(
          grades(testingState, actions.csvUpload.error({
            errorMessage,
            uploadSuccess: false,
          })),
        ).toEqual({
          ...testingState,
          showSpinner: false,
          bulkManagement: { errorMessage, ...testingState.bulkManagement },
        });
      });
    });

    describe('actions.doneViewingAssignment', () => {
      it('removes gradeOverride* and gradeOriginal* from existing state', () => {
        const {
          gradeOverrideHistoryResults,
          gradeOverrideCurrentEarnedAllOverride,
          gradeOverrideCurrentPossibleAllOverride,
          gradeOverrideCurrentEarnedGradedOverride,
          gradeOverrideCurrentPossibleGradedOverride,
          gradeOriginalEarnedAll,
          gradeOriginalPossibleAll,
          gradeOriginalEarnedGraded,
          gradeOriginalPossibleGraded,
          ...expected
        } = testingState;
        expect(
          grades(testingState, actions.doneViewingAssignment()),
        ).toEqual(expected);
      });
    });

    describe('actions.fetching.started', () => {
      it('sets startedFetching and showSpinner to true', () => {
        expect(
          grades(testingState, actions.fetching.started()),
        ).toEqual({
          ...testingState,
          startedFetching: true,
          showSpinner: true,
        });
      });
    });
    describe('actions.fetching.received', () => {
      it(
        'loads payload and sets finishedFetching:true, errorFetching:false, showSpinner:false',
        () => {
          const payload = {
            courseId: 'course-v1:edX+DemoX+Demo_Course',
            headings: 'some Headings',
            prev: 'testPrevUrl',
            next: 'testNextUrl',
            track: 'verified',
            cohortId: 2,
            totalUsersCount: 4,
            filteredUsersCount: 2,
            assignmentType: 'Homework',
            grades: { somethingArbitrary: 'some data' },
          };
          expect(
            grades(testingState, actions.fetching.received(payload)),
          ).toEqual({
            ...testingState,
            results: payload.grades,
            headings: payload.headings,
            prevPage: payload.prev,
            nextPage: payload.next,
            courseId: payload.courseId,
            totalUsersCount: payload.totalUsersCount,
            filteredUsersCount: payload.filteredUsersCount,
            errorFetching: false,
            finishedFetching: true,
            showSpinner: false,
          });
        },
      );
    });
    describe('actions.fetching.error', () => {
      it('sets finishedFetching and errorFetching to true', () => {
        expect(
          grades(testingState, actions.fetching.error()),
        ).toEqual({
          ...testingState,
          errorFetching: true,
          finishedFetching: true,
        });
      });
    });

    describe('actions.overrideHistory.received', () => {
      it('loads payload and clears overrideHistoryError', () => {
        const payload = {
          overrideHistory: true,
          currentEarnedAllOverride: false,
          currentPossibleAllOverride: 'red',
          currentEarnedGradedOverride: 'green',
          currentPossibleGradedOverride: 'blue',
          originalGradeEarnedAll: 'other',
          originalGradePossibleAll: 'sparrow',
          originalGradeEarnedGraded: 'crow',
          originalGradePossibleGraded: 'raven',
        };
        expect(
          grades(testingState, actions.overrideHistory.received(payload)),
        ).toEqual({
          ...testingState,
          gradeOverrideHistoryResults: payload.overrideHistory,
          gradeOverrideCurrentEarnedAllOverride: payload.currentEarnedAllOverride,
          gradeOverrideCurrentPossibleAllOverride: payload.currentPossibleAllOverride,
          gradeOverrideCurrentEarnedGradedOverride: payload.currentEarnedGradedOverride,
          gradeOverrideCurrentPossibleGradedOverride: payload.currentPossibleGradedOverride,
          gradeOriginalEarnedAll: payload.originalGradeEarnedAll,
          gradeOriginalPossibleAll: payload.originalGradePossibleAll,
          gradeOriginalEarnedGraded: payload.originalGradeEarnedGraded,
          gradeOriginalPossibleGraded: payload.originalGradePossibleGraded,
          overrideHistoryError: '',
        });
      });
    });
    describe('actions.overrideHistory.error', () => {
      it(
        'sets finishedFetchingOverrideHistory=true and loads overrideHistoryError from payload',
        () => {
          const errorMessage = 'This is the error message';
          expect(
            grades(testingState, actions.overrideHistory.error(errorMessage)),
          ).toEqual({
            ...testingState,
            finishedFetchingOverrideHistory: true,
            overrideHistoryError: errorMessage,
          });
        },
      );
    });

    describe('handling actions.toggleGradeFormat', () => {
      it('updates grade format attribute', () => {
        const formatTypeData = 'percent';
        expect(
          grades(undefined, actions.toggleGradeFormat({ target: { value: formatTypeData } })),
        ).toEqual({ ...initialState, gradeFormat: formatTypeData });
      });
    });

    describe('handling actions.update.request', () => {
      it('sets showSpinner: true', () => {
        expect(
          grades(testingState, actions.update.request()),
        ).toEqual({ ...testingState, showSpinner: true });
      });
    });
    describe('actions.update.success', () => {
      it('sets showSpinner: false', () => {
        expect(
          grades({ ...testingState, showSpinner: true }, actions.update.success()),
        ).toEqual({ ...testingState, showSpinner: false });
      });
    });
    describe('actions.update.failure', () => {
      it('sets showSpinner: false', () => {
        expect(
          grades({ ...testingState, showSpinner: true }, actions.update.failure()),
        ).toEqual({ ...testingState, showSpinner: false });
      });
    });
    describe('handling filterActions.update.assignmentType', () => {
      it('loads assignmentType and headings from the payload', () => {
        const expectedSelectedAssignmentType = 'selected assignment type';
        expect(
          grades(testingState, filterActions.update.assignmentType({
            headings: headingsData,
            filterType: expectedSelectedAssignmentType,
          })),
        ).toEqual({
          ...testingState,
          selectedAssignmentType: expectedSelectedAssignmentType,
          headings: headingsData,
        });
      });
    });
  });
});
