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

describe('grades reducer group', () => {
  it('has initial state', () => {
    expect(
      grades(undefined, {}),
    ).toEqual(initialState);
  });

  it('updates fetch grades request state', () => {
    const expected = {
      ...initialState,
      startedFetching: true,
      showSpinner: true,
    };
    expect(
      grades(undefined, {
        type: actions.fetching.started.toString(),
      }),
    ).toEqual(expected);
  });

  it('updates fetch grades success state', () => {
    const expectedPrev = 'testPrevUrl';
    const expectedNext = 'testNextUrl';
    const expectedTrack = 'verified';
    const expectedCohortId = 2;
    const expectedTotalUsersCount = 4;
    const expectedFilterUsersCount = 2;
    const expected = {
      ...initialState,
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
      grades(undefined, actions.received({
        grades: gradesData,
        headings: headingsData,
        next: expectedNext,
        prev: expectedPrev,
        track: expectedTrack,
        totalUsersCount: expectedTotalUsersCount,
        cohort: expectedCohortId,
        courseId,
        filteredUsersCount: expectedFilterUsersCount,
      })),
    ).toEqual(expected);
  });

  it('updates toggle grade format state success', () => {
    const formatTypeData = 'percent';
    const expected = {
      ...initialState,
      gradeFormat: formatTypeData,
    };
    expect(
      grades(undefined, actions.toggleGradeFormat(formatTypeData)),
    ).toEqual(expected);
  });

  it('updates filter columns state success', () => {
    const expectedSelectedAssignmentType = 'selected assignment type';
    const expected = {
      ...initialState,
      selectedAssignmentType: expectedSelectedAssignmentType,
      headings: headingsData,
    };
    expect(
      grades(undefined, filterActions.update.assignmentType({
        headings: headingsData,
        filterType: expectedSelectedAssignmentType,
      })),
    ).toEqual(expected);
  });

  it('updates fetch grades failure state', () => {
    const expected = {
      ...initialState,
      errorFetching: true,
      finishedFetching: true,
    };
    expect(
      grades(undefined, actions.fetching.error()),
    ).toEqual(expected);
  });
});

describe('banner group', () => {
  it('updates update_banner state success', () => {
    const expectedShowSuccess = true;
    const expected = {
      ...initialState,
      showSuccess: expectedShowSuccess,
    };
    expect(
      grades(undefined, actions.banner.open()),
    ).toEqual(expected);
  });

  it('updates update_banner state fail', () => {
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

describe('override history group', () => {
  it('updates fetch grade override history failure state', () => {
    const errorMessage = 'This is the error message';
    const expected = {
      ...initialState,
      finishedFetchingOverrideHistory: true,
      overrideHistoryError: errorMessage,
    };
    expect(
      grades(undefined, actions.overrideHistory.errorFetching(errorMessage)),
    ).toEqual(expected);
  });

  it('updates fetch grade override history success state', () => {
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
      ...initialState,
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
      grades(undefined, actions.overrideHistory.received(payload)),
    ).toEqual(expected);
  });
});

describe('bulk history group', () => {
  it('updates bulk history received state', () => {
    const payload = 'history';
    const expected = {
      ...initialState,
      bulkManagement: {
        ...initialState.bulkManagement,
        history: payload,
      },
    };
    expect(
      grades(undefined, actions.bulkHistory.received(payload)),
    ).toEqual(expected);
  });
});

describe('csv upload group', () => {
  it('updates csv upload request state', () => {
    const expected = {
      ...initialState,
      showSpinner: true,
      bulkManagement: initialState.bulkManagement,
    };
    expect(
      grades(undefined, actions.csvUpload.started()),
    ).toEqual(expected);
  });

  it('updates csv upload request finish', () => {
    const expected = {
      ...initialState,
      showSpinner: false,
      bulkManagement: {
        uploadSuccess: true,
        ...initialState.bulkManagement,
      },
    };
    expect(
      grades(undefined, actions.csvUpload.finished()),
    ).toEqual(expected);
  });

  it('updates csv upload request error', () => {
    const errorMessage = 'This is an error message';
    const expected = {
      ...initialState,
      showSpinner: false,
      bulkManagement: {
        errorMessage,
        ...initialState.bulkManagement,
      },
    };
    expect(
      grades(undefined, actions.csvUpload.error({ errorMessage })),
    ).toEqual(expected);
  });
});

describe('viewing assignment group', () => {
  it('update done viewing assignment', () => {
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
    } = initialState;
    expect(
      grades(undefined, actions.doneViewingAssignment()),
    ).toEqual(expected);
  });
});
