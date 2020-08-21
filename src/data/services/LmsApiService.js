import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { configuration } from '../../config';

class LmsApiService {
  static baseUrl = configuration.LMS_BASE_URL;

  static pageSize = 25

  static fetchGradebookData(courseId, searchText, cohort, track, options = {}) {
    const queryParams = {};
    queryParams.page_size = LmsApiService.pageSize;
    if (searchText) {
      queryParams.user_contains = searchText;
    }
    if (cohort) {
      queryParams.cohort_id = cohort;
    }
    if (track) {
      queryParams.enrollment_mode = track;
    }
    if (options.assignmentGradeMax || options.assignmentGradeMin) {
      if (!options.assignment) {
        throw new Error('Gradebook LMS API requires assignment to be set to filter by min/max assig. grade');
      }
      queryParams.assignment = options.assignment;
      if (options.assignmentGradeMin) {
        queryParams.assignment_grade_min = options.assignmentGradeMin;
      }
      if (options.assignmentGradeMax) {
        queryParams.assignment_grade_max = options.assignmentGradeMax;
      }
    }
    if (options.courseGradeMin) {
      queryParams.course_grade_min = options.courseGradeMin;
    }
    if (options.courseGradeMax) {
      queryParams.course_grade_max = options.courseGradeMax;
    }

    const queryParamString = Object.keys(queryParams)
      .map(attr => `${attr}=${encodeURIComponent(queryParams[attr])}`)
      .join('&');

    const gradebookUrl = `${LmsApiService.baseUrl}/api/grades/v1/gradebook/${courseId}/?${queryParamString}`;

    return getAuthenticatedHttpClient().get(gradebookUrl);
  }

  static updateGradebookData(courseId, updateData) {
    /*
       updateData is expected to be a list of objects with the keys 'user_id' (an integer),
       'usage_id' (a string) and 'grade', which is an object with the keys:
       'earned_all_override',
       'possible_all_override',
       'earned_graded_override',
       and 'possible_graded_override',
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
              "possible_graded_override": 11,
              "comment": "reason for override"
            }
          }
        ]
    */
    const gradebookUrl = `${LmsApiService.baseUrl}/api/grades/v1/gradebook/${courseId}/bulk-update`;
    return getAuthenticatedHttpClient().post(gradebookUrl, updateData);
  }

  static fetchTracks(courseId) {
    const trackUrl = `${LmsApiService.baseUrl}/api/enrollment/v1/course/${courseId}?include_expired=1`;
    return getAuthenticatedHttpClient().get(trackUrl);
  }

  static fetchCohorts(courseId) {
    const cohortsUrl = `${LmsApiService.baseUrl}/courses/${courseId}/cohorts/`;
    return getAuthenticatedHttpClient().get(cohortsUrl);
  }

  static fetchAssignmentTypes(courseId) {
    const assignmentTypesUrl = `${LmsApiService.baseUrl}/api/grades/v1/gradebook/${courseId}/grading-info?graded_only=true`;
    return getAuthenticatedHttpClient().get(assignmentTypesUrl);
  }

  static fetchUserRoles(courseId) {
    const rolesUrl = `${LmsApiService.baseUrl}/api/enrollment/v1/roles/?course_id=${encodeURIComponent(courseId)}`;
    return getAuthenticatedHttpClient().get(rolesUrl);
  }

  static getGradeExportCsvUrl(courseId, options = {}) {
    const queryParams = ['track', 'cohort', 'assignment', 'assignmentType', 'assignmentGradeMax',
      'assignmentGradeMin', 'courseGradeMin', 'courseGradeMax']
      .filter(opt => options[opt]
                   && options[opt] !== 'All')
      .map(opt => `${opt}=${encodeURIComponent(options[opt])}`)
      .join('&');
    return `${LmsApiService.baseUrl}/api/bulk_grades/course/${courseId}/?${queryParams}`;
  }

  static getInterventionExportCsvUrl(courseId, options = {}) {
    const queryParams = ['track', 'cohort', 'assignment', 'assignmentType', 'assignmentGradeMax',
      'assignmentGradeMin', 'courseGradeMin', 'courseGradeMax']
      .filter(opt => options[opt]
                   && options[opt] !== 'All')
      .map(opt => `${opt}=${encodeURIComponent(options[opt])}`)
      .join('&');
    return `${LmsApiService.baseUrl}/api/bulk_grades/course/${courseId}/intervention?${queryParams}`;
  }

  static getGradeImportCsvUrl = LmsApiService.getGradeExportCsvUrl;

  static uploadGradeCsv(courseId, formData) {
    const fileUploadUrl = LmsApiService.getGradeImportCsvUrl(courseId);
    return getAuthenticatedHttpClient().post(fileUploadUrl, formData).then((result) => {
      if (result.status === 200 && !result.data.error_messages.length) {
        return result.data;
      }
      return Promise.reject(result);
    });
  }

  static fetchGradeBulkOperationHistory(courseId) {
    const url = `${LmsApiService.baseUrl}/api/bulk_grades/course/${courseId}/history/`;
    return getAuthenticatedHttpClient().get(url).then(response => response.data).catch(() => Promise.reject(Error('unhandled response error')));
  }

  static fetchGradeOverrideHistory(subsectionId, userId) {
    const historyUrl = `${LmsApiService.baseUrl}/api/grades/v1/subsection/${subsectionId}/?user_id=${userId}&history_record_limit=5`;
    return getAuthenticatedHttpClient().get(historyUrl);
  }
}

export default LmsApiService;
