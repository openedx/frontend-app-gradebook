import apiClient from '../apiClient';
import { configuration } from '../../config';

class LmsApiService {
  static baseUrl = configuration.LMS_BASE_URL;

  static fetchGradebookData(courseId) {
    const fixedCourseId = 'course-v1:edX+DemoX+Demo_Course';  // TODO: get rid of this in favor of courseId
    const gradebookUrl = `${LmsApiService.baseUrl}/api/grades/v1/gradebook/${fixedCourseId}/`;
    return apiClient.get(gradebookUrl);
  }
}

export default LmsApiService;
