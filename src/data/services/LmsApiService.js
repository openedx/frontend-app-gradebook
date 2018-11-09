import apiClient from '../apiClient';
import { configuration } from '../../config';

class LmsApiService {
  static baseUrl = configuration.LMS_BASE_URL;

  static fetchGradebookData(courseId, searchText) {
    let gradebookUrl = `${LmsApiService.baseUrl}/api/grades/v1/gradebook/${courseId}/`;
    if (searchText) {
      gradebookUrl += `?username_contains=${searchText}`;
    }
    return apiClient.get(gradebookUrl);
  }
}

export default LmsApiService;
