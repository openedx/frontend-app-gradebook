import apiClient from '../apiClient';
import { configuration } from '../../config';

class LmsApiService {
  static baseUrl = configuration.LMS_BASE_URL;
  static pageSize = 10

  static fetchGradebookData(courseId, searchText, cohort, track) {
    let gradebookUrl = `${LmsApiService.baseUrl}/api/grades/v1/gradebook/${courseId}/`;

    gradebookUrl += `?page_size=${LmsApiService.pageSize}&`;
    if (searchText) {
      gradebookUrl += `username_contains=${searchText}&`;
    }
    if (cohort) {
      gradebookUrl += `cohort_id=${cohort}&`;
    }
    if (track) {
      gradebookUrl += `enrollment_mode=${track}`;
    }
    return apiClient.get(gradebookUrl);
  }

  static updateGradebookData(courseId, updateData) {
    /*
       updateData is expected to be a list of objects with the keys 'user_id' (an integer),
       'usage_id' (a string) and 'grade', which is an object with the keys:
       'earned_all_override', 'possible_all_override', 'earned_graded_override', and 'possible_graded_override',
       each of which should be an integer.
       Example:
       [
         {
            "user_id": 9,
            "usage_id": "block-v1:edX+DemoX+Demo_Course+type@sequential+block@basic_questions",
            "grade": {
              "earned_all_override": 11,
              "possible_all_override": 11,
              "earned_graded_override": 11,
              "possible_graded_override": 11
            }
          }
        ]
    */
    const gradebookUrl = `${LmsApiService.baseUrl}/api/grades/v1/gradebook/${courseId}/bulk-update`;
    return apiClient.post(gradebookUrl, updateData);
  }

  static fetchTracks(courseId) {
    const trackUrl = `${LmsApiService.baseUrl}/api/enrollment/v1/course/${courseId}?include_expired=1`;
    return apiClient.get(trackUrl);
  }

  static fetchCohorts(courseId) {
    const cohortsUrl = `${LmsApiService.baseUrl}/courses/${courseId}/cohorts/`;
    return apiClient.get(cohortsUrl);
  }

  static fetchAssignmentTypes(courseId) {
    const assignmentTypesUrl = `${LmsApiService.baseUrl}/api/grades/v1/gradebook/${courseId}/grading-info?graded_only=true`;
    return apiClient.get(assignmentTypesUrl);
  }

  static fetchUserRoles(courseId) {
    const rolesUrl = `${LmsApiService.baseUrl}/api/enrollment/v1/roles/?course_id=${encodeURIComponent(courseId)}`;
    return apiClient.get(rolesUrl);
  }
}

export default LmsApiService;
