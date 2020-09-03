import axios from 'axios';
import configureMockStore from 'redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import thunk from 'redux-thunk';

import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { configuration } from '../../config';
import { fetchGrades, fetchGradeOverrideHistory } from './grades';
import {
  STARTED_FETCHING_GRADES,
  FINISHED_FETCHING_GRADES,
  ERROR_FETCHING_GRADES,
  GOT_GRADES,
  GOT_GRADE_OVERRIDE_HISTORY,
  ERROR_FETCHING_GRADE_OVERRIDE_HISTORY,
} from '../constants/actionTypes/grades';
import GRADE_OVERRIDE_HISTORY_ERROR_DEFAULT_MSG from '../constants/errors';
import { sortAlphaAsc } from './utils';
import LmsApiService from '../services/LmsApiService';

const mockStore = configureMockStore([thunk]);

jest.mock('@edx/frontend-platform/auth');
const axiosMock = new MockAdapter(axios);
getAuthenticatedHttpClient.mockReturnValue(axios);
axios.isAccessTokenExpired = jest.fn();
axios.isAccessTokenExpired.mockReturnValue(false);

describe('actions', () => {
  afterEach(() => {
    axiosMock.reset();
  });

  describe('fetchGrades', () => {
    const courseId = 'course-v1:edX+DemoX+Demo_Course';
    const expectedCohort = 1;
    const expectedTrack = 'verified';
    const expectedAssignmentType = 'Exam';
    const fetchGradesURL = `${configuration.LMS_BASE_URL}/api/grades/v1/gradebook/${courseId}/?page_size=25&cohort_id=${expectedCohort}&enrollment_mode=${expectedTrack}`;
    const responseData = {
      next: `${fetchGradesURL}&cursor=2344fda`,
      previous: null,
      results: [
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
        }],
    };

    it('dispatches success action after fetching grades', () => {
      const expectedActions = [
        { type: STARTED_FETCHING_GRADES },
        {
          type: GOT_GRADES,
          grades: responseData.results.sort(sortAlphaAsc),
          cohort: expectedCohort,
          track: expectedTrack,
          assignmentType: expectedAssignmentType,
          prev: responseData.previous,
          next: responseData.next,
          courseId,
        },
        { type: FINISHED_FETCHING_GRADES },
      ];
      const store = mockStore();

      axiosMock.onGet(fetchGradesURL)
        .replyOnce(200, JSON.stringify(responseData));

      return store.dispatch(fetchGrades(
        courseId,
        expectedCohort,
        expectedTrack,
        expectedAssignmentType,
        false,
      )).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('dispatches failure action after fetching grades', () => {
      const expectedActions = [
        { type: STARTED_FETCHING_GRADES },
        { type: ERROR_FETCHING_GRADES },
      ];
      const store = mockStore();

      axiosMock.onGet(fetchGradesURL)
        .replyOnce(500, JSON.stringify({}));

      return store.dispatch(fetchGrades(
        courseId,
        expectedCohort,
        expectedTrack,
        expectedAssignmentType,
        false,
      )).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('dispatches success action on empty response after fetching grades', () => {
      const emptyResponseData = {
        next: responseData.next,
        previous: responseData.previous,
        results: [],
      };
      const expectedActions = [
        { type: STARTED_FETCHING_GRADES },
        {
          type: GOT_GRADES,
          grades: [],
          cohort: expectedCohort,
          track: expectedTrack,
          assignmentType: expectedAssignmentType,
          prev: responseData.previous,
          next: responseData.next,
          courseId,
        },
        { type: FINISHED_FETCHING_GRADES },
      ];
      const store = mockStore();

      axiosMock.onGet(fetchGradesURL)
        .replyOnce(200, JSON.stringify(emptyResponseData));

      return store.dispatch(fetchGrades(
        courseId,
        expectedCohort,
        expectedTrack,
        expectedAssignmentType,
        false,
      )).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  describe('fetchGradeOverridHistory', () => {
    const subsectionId = 'subsectionId-11111';
    const userId = 'user-id-11111';

    const fetchOverridesURL = `${LmsApiService.baseUrl}/api/grades/v1/subsection/${subsectionId}/?user_id=${userId}&history_record_limit=5`;

    const originalGrade = {
      earned_all: 1.0,
      possible_all: 12.0,
      earned_graded: 3.0,
      possible_graded: 8.0,
    };

    const override = {
      earned_all_override: 13.0,
      possible_all_override: 13.0,
      earned_graded_override: 10.0,
      possible_graded_override: 10.0,
    };

    it('dispatches success action after successfully getting override info', () => {
      const responseData = {
        success: true,
        original_grade: originalGrade,
        history: [],
        override,
      };

      axiosMock.onGet(fetchOverridesURL)
        .replyOnce(200, JSON.stringify(responseData));

      const expectedActions = [
        {
          type: GOT_GRADE_OVERRIDE_HISTORY,
          overrideHistory: [],
          currentEarnedAllOverride: override.earned_all_override,
          currentPossibleAllOverride: override.possible_all_override,
          currentEarnedGradedOverride: override.earned_graded_override,
          currentPossibleGradedOverride: override.possible_graded_override,
          originalGradeEarnedAll: originalGrade.earned_all,
          originalGradePossibleAll: originalGrade.possible_all,
          originalGradeEarnedGraded: originalGrade.earned_graded,
          originalGradePossibleGraded: originalGrade.possible_graded,
        },
      ];
      const store = mockStore();

      return store.dispatch(fetchGradeOverrideHistory(subsectionId, userId)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    describe('dispatches failure action with expected message', () => {
      test('on failure response', () => {
        const responseData = {
          success: false,
          error_message: 'There was an error!!!!!!!!!',
        };

        axiosMock.onGet(fetchOverridesURL).replyOnce(200, JSON.stringify(responseData));

        const expectedActions = [{
          type: ERROR_FETCHING_GRADE_OVERRIDE_HISTORY,
          errorMessage: responseData.error_message,
        }];
        const store = mockStore();

        return store.dispatch(fetchGradeOverrideHistory(subsectionId, userId)).then(() => {
          expect(store.getActions()).toEqual(expectedActions);
        });
      });

      test('on 500 error', () => {
        axiosMock.onGet(fetchOverridesURL).replyOnce(500);

        const expectedActions = [{
          type: ERROR_FETCHING_GRADE_OVERRIDE_HISTORY,
          errorMessage: GRADE_OVERRIDE_HISTORY_ERROR_DEFAULT_MSG,
        }];
        const store = mockStore();

        return store.dispatch(fetchGradeOverrideHistory(subsectionId, userId)).then(() => {
          expect(store.getActions()).toEqual(expectedActions);
        });
      });
    });
  });
});
