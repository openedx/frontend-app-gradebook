import grades, { initialGradesState as initialState } from './grades';
import actions from '../actions/grades';
import filterActions from '../actions/filters';

const courseId = 'course-v1:edX+DemoX+Demo_Course';
const headingsData = [
  { name: 'exam' },
  { name: 'homework2' },
];
const gradesData = [
  {
    course_id: courseId,
    email: 'user1@example.com',
    username: 'user1',
    user_id: 1,
    percent: 0.5,
    letter_grade: null,
    section_breakdown: [
      {
        subsection_name: 'Demo Course Overview',
        score_earned: 0,
        score_possible: 0,
        percent: 0,
        displayed_value: '0.00',
        grade_description: '(0.00/0.00)',
      },
      {
        subsection_name: 'Example Week 1: Getting Started',
        score_earned: 1,
        score_possible: 1,
        percent: 1,
        displayed_value: '1.00',
        grade_description: '(0.00/0.00)',
      },
    ],
  },
  {
    course_id: courseId,
    email: 'user22@example.com',
    username: 'user22',
    user_id: 22,
    percent: 0,
    letter_grade: null,
    section_breakdown: [
      {
        subsection_name: 'Demo Course Overview',
        score_earned: 0,
        score_possible: 0,
        percent: 0,
        displayed_value: '0.00',
        grade_description: '(0.00/0.00)',
      },
      {
        subsection_name: 'Example Week 1: Getting Started',
        score_earned: 1,
        score_possible: 1,
        percent: 0,
        displayed_value: '0.00',
        grade_description: '(0.00/0.00)',
      },
    ],
  }];

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

  describe('handling actions.received', () => {
    it('finish fetch then set error and show spinner to false. Add grade data to the results.', () => {
      const expectedPrev = 'testPrevUrl';
      const expectedNext = 'testNextUrl';
      const expectedTrack = 'verified';
      const expectedCohortId = 2;
      const expectedTotalUsersCount = 4;
      const expectedFilterUsersCount = 2;
      const payload = {
        grades: gradesData,
        headings: headingsData,
        next: expectedNext,
        prev: expectedPrev,
        track: expectedTrack,
        totalUsersCount: expectedTotalUsersCount,
        cohort: expectedCohortId,
        courseId,
        filteredUsersCount: expectedFilterUsersCount,
      };

      const expected = {
        ...testingState,
        results: gradesData,
        headings: headingsData,
        errorFetching: false,
        finishedFetching: true,
        prevPage: expectedPrev,
        nextPage: expectedNext,
        showSpinner: false,
        courseId,
        totalUsersCount: expectedTotalUsersCount,
        filteredUsersCount: expectedFilterUsersCount,
      };

      expect(
        grades(testingState, actions.received(payload)),
      ).toEqual(expected);
    });
  });

  describe('handling grade fetching actions', () => {
    describe('handling actions.fetching.started', () => {
      it('set start fetching and show spinner to true. Preserve the results if existed', () => {
        const expected = {
          ...testingState,
          startedFetching: true,
          showSpinner: true,
        };
        expect(
          grades(testingState, {
            type: actions.fetching.started.toString(),
          }),
        ).toEqual(expected);
      });
    });
    describe('handling actions.fetching.error', () => {
      it('set finish fetching and error to true. Preserve existing state.', () => {
        const expected = {
          ...testingState,
          errorFetching: true,
          finishedFetching: true,
        };
        expect(
          grades(testingState, actions.fetching.error()),
        ).toEqual(expected);
      });
    });
  });

  describe('handling actions.toggleGradeFormat', () => {
    it('updates grade format attribute', () => {
      const formatTypeData = 'percent';
      const expected = {
        ...initialState,
        gradeFormat: formatTypeData,
      };
      expect(
        grades(undefined, actions.toggleGradeFormat(formatTypeData)),
      ).toEqual(expected);
    });
  });

  describe('handling banner actions', () => {
    describe('handling actions.banner.open', () => {
      it('set showSuccess to true', () => {
        const expectedShowSuccess = true;
        const expected = {
          ...initialState,
          showSuccess: expectedShowSuccess,
        };
        expect(
          grades(undefined, actions.banner.open()),
        ).toEqual(expected);
      });
    });
    describe('handling actions.banner.close', () => {
      it('set showSuccess to false', () => {
        const expectedShowSuccess = false;
        const expected = {
          ...initialState,
          showSuccess: expectedShowSuccess,
        };
        expect(
          grades(undefined, actions.banner.close()),
        ).toEqual(expected);
      });
    });
  });

  describe('override history actions', () => {
    describe('handling actions.overrideHistory.errorFetching', () => {
      it('set finish override to true and update error message. Preserve everything else if existed.', () => {
        const errorMessage = 'This is the error message';
        const expected = {
          ...testingState,
          finishedFetchingOverrideHistory: true,
          overrideHistoryError: errorMessage,
        };
        expect(
          grades(testingState, actions.overrideHistory.errorFetching(errorMessage)),
        ).toEqual(expected);
      });
    });
    describe('handling actions.overrideHistory.received', () => {
      it('set error to empty string then replace payload with existing state', () => {
        const expectedOverrideHistory = true;
        const expectedCurrentEarnedAllOverride = true;
        const expectedCurrentPossibleAllOverride = true;
        const expectedCurrentEarnedGradedOverride = true;
        const expectedCurrentPossibleGradedOverride = true;
        const expectedOriginalGradeEarnedAll = true;
        const expectedOriginalGradePossibleAll = true;
        const expectedOriginalGradeEarnedGraded = true;
        const expectedOriginalGradePossibleGraded = true;

        const payload = {
          overrideHistory: expectedOverrideHistory,
          currentEarnedAllOverride: expectedCurrentEarnedAllOverride,
          currentPossibleAllOverride: expectedCurrentPossibleAllOverride,
          currentEarnedGradedOverride: expectedCurrentEarnedGradedOverride,
          currentPossibleGradedOverride: expectedCurrentPossibleGradedOverride,
          originalGradeEarnedAll: expectedOriginalGradeEarnedAll,
          originalGradePossibleAll: expectedOriginalGradePossibleAll,
          originalGradeEarnedGraded: expectedOriginalGradeEarnedGraded,
          originalGradePossibleGraded: expectedOriginalGradePossibleGraded,
        };
        const expected = {
          ...testingState,
          gradeOverrideHistoryResults: expectedOverrideHistory,
          gradeOverrideCurrentEarnedAllOverride: expectedCurrentEarnedAllOverride,
          gradeOverrideCurrentPossibleAllOverride: expectedCurrentPossibleAllOverride,
          gradeOverrideCurrentEarnedGradedOverride: expectedCurrentEarnedGradedOverride,
          gradeOverrideCurrentPossibleGradedOverride: expectedCurrentPossibleGradedOverride,
          gradeOriginalEarnedAll: expectedOriginalGradeEarnedAll,
          gradeOriginalPossibleAll: expectedOriginalGradePossibleAll,
          gradeOriginalEarnedGraded: expectedOriginalGradeEarnedGraded,
          gradeOriginalPossibleGraded: expectedOriginalGradePossibleGraded,
          overrideHistoryError: '',
        };
        expect(
          grades(testingState, actions.overrideHistory.received(payload)),
        ).toEqual(expected);
      });
    });
  });

  describe('handling actions.bulkHistory.received', () => {
    it('add payload to existing bulkManagement history attribute. Preserve everything else.', () => {
      const payload = 'history';
      const expectedBulkManagement = {
        ...testingState.bulkManagement,
        history: payload,
      };
      const expected = {
        ...testingState,
        bulkManagement: expectedBulkManagement,
      };
      expect(
        grades(testingState, actions.bulkHistory.received(payload)),
      ).toEqual(expected);
    });
  });

  describe('hanlding csv upload', () => {
    describe('handling acitons.csvUpload.started', () => {
      it('show spinner then remove error message and upload success from bulkManagement', () => {
        const { errorMessages, uploadSuccess, ...expectedBulkManagement } = testingState.bulkManagement;
        const expected = {
          ...testingState,
          showSpinner: true,
          bulkManagement: expectedBulkManagement,
        };
        expect(
          grades(testingState, actions.csvUpload.started()),
        ).toEqual(expected);
      });
    });
    describe('handling acitons.csvUpload.finished', () => {
      it('hide spinner, remove error message and set uploadSuccess to true', () => {
        const { errorMessages, ...rest } = testingState.bulkManagement;
        const expected = {
          ...testingState,
          showSpinner: false,
          bulkManagement: {
            ...rest,
            uploadSuccess: true,
          },
        };
        expect(
          grades(testingState, actions.csvUpload.finished()),
        ).toEqual(expected);
      });
    });
    describe('handling acitons.csvUpload.error', () => {
      it('hide spinner and update error message', () => {
        const errorMessage = 'This is a new error message';
        const expected = {
          ...testingState,
          showSpinner: false,
          bulkManagement: {
            errorMessage,
            ...testingState.bulkManagement,
          },
        };
        expect(
          grades(testingState, actions.csvUpload.error({
            errorMessage,
            uploadSuccess: false,
          })),
        ).toEqual(expected);
      });
    });
  });

  describe('handling actions.doneViewingAssignment', () => {
    it('remove gradeOverride* and gradeOriginal* from existing state', () => {
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

  describe('handling filterActions.update.assignmentType', () => {
    it('update filter type and headings from the payload', () => {
      const expectedSelectedAssignmentType = 'selected assignment type';
      const expected = {
        ...testingState,
        selectedAssignmentType: expectedSelectedAssignmentType,
        headings: headingsData,
      };
      expect(
        grades(testingState, filterActions.update.assignmentType({
          headings: headingsData,
          filterType: expectedSelectedAssignmentType,
        })),
      ).toEqual(expected);
    });
  });
});
