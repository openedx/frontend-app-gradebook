import grades, { initialGradesState as initialState } from './grades';
import {
  STARTED_FETCHING_GRADES,
  ERROR_FETCHING_GRADES,
  GOT_GRADES,
  TOGGLE_GRADE_FORMAT,
  FILTER_BY_ASSIGNMENT_TYPE,
  OPEN_BANNER,
  ERROR_FETCHING_GRADE_OVERRIDE_HISTORY,
} from '../constants/actionTypes/grades';

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

describe('grades reducer', () => {
  it('has initial state', () => {
    expect(grades(undefined, {})).toEqual(initialState);
  });

  it('updates fetch grades request state', () => {
    const expected = {
      ...initialState,
      startedFetching: true,
      showSpinner: true,
    };
    expect(grades(undefined, {
      type: STARTED_FETCHING_GRADES,
    })).toEqual(expected);
  });

  it('updates fetch grades success state', () => {
    const expectedPrev = 'testPrevUrl';
    const expectedNext = 'testNextUrl';
    const expectedTrack = 'verified';
    const expectedCohortId = 2;
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
      totalUsersCount: 4,
      filteredUsersCount: 2,
    };
    expect(grades(undefined, {
      type: GOT_GRADES,
      grades: gradesData,
      headings: headingsData,
      prev: expectedPrev,
      next: expectedNext,
      track: expectedTrack,
      cohort: expectedCohortId,
      showSpinner: true,
      courseId,
      totalUsersCount: 4,
      filteredUsersCount: 2,
    })).toEqual(expected);
  });

  it('updates toggle grade format state success', () => {
    const formatTypeData = 'percent';
    const expected = {
      ...initialState,
      gradeFormat: formatTypeData,
    };
    expect(grades(undefined, {
      type: TOGGLE_GRADE_FORMAT,
      formatType: formatTypeData,
    })).toEqual(expected);
  });

  it('updates filter columns state success', () => {
    const expectedHeadings = headingsData;
    const expected = {
      ...initialState,
      headings: expectedHeadings,
    };
    expect(grades(undefined, {
      type: FILTER_BY_ASSIGNMENT_TYPE,
      headings: expectedHeadings,
    })).toEqual(expected);
  });

  it('updates update_banner state success', () => {
    const expectedShowSuccess = true;
    const expected = {
      ...initialState,
      showSuccess: expectedShowSuccess,
    };
    expect(grades(undefined, {
      type: OPEN_BANNER,
    })).toEqual(expected);
  });

  it('updates fetch grades failure state', () => {
    const expected = {
      ...initialState,
      errorFetching: true,
      finishedFetching: true,
    };
    expect(grades(undefined, {
      type: ERROR_FETCHING_GRADES,
    })).toEqual(expected);
  });

  it('updates fetch grade override history failure state', () => {
    const errorMessage = 'This is the error message';
    const expected = {
      ...initialState,
      finishedFetchingOverrideHistory: true,
      overrideHistoryError: errorMessage,
    };
    expect(grades(undefined, {
      type: ERROR_FETCHING_GRADE_OVERRIDE_HISTORY,
      errorMessage,
    })).toEqual(expected);
  });
});
