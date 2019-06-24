import configureMockStore from 'redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import thunk from 'redux-thunk';

import apiClient from '../apiClient';
import { configuration } from '../../config';
import { fetchGrades } from './grades';
import {
  STARTED_FETCHING_GRADES,
  FINISHED_FETCHING_GRADES,
  ERROR_FETCHING_GRADES,
  GOT_GRADES,
  UPDATE_BANNER,
} from '../constants/actionTypes/grades';
import { sortAlphaAsc } from './utils';


const mockStore = configureMockStore([thunk]);
const axiosMock = new MockAdapter(apiClient);
apiClient.isAccessTokenExpired = jest.fn();
apiClient.isAccessTokenExpired.mockReturnValue(false);

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
          headings: [
            'Username',
            'Email',
            'Total',
          ],
          prev: responseData.previous,
          next: responseData.next,
          courseId,
        },
        { type: FINISHED_FETCHING_GRADES },
        { type: UPDATE_BANNER, showSuccess: false },
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
          headings: [],
          prev: responseData.previous,
          next: responseData.next,
          courseId,
        },
        { type: FINISHED_FETCHING_GRADES },
        { type: UPDATE_BANNER, showSuccess: false },
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
});
