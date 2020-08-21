import {
  STARTED_FETCHING_ASSIGNMENT_TYPES,
  GOT_ASSIGNMENT_TYPES,
  ERROR_FETCHING_ASSIGNMENT_TYPES,
  GOT_ARE_GRADES_FROZEN,
} from '../constants/actionTypes/assignmentTypes';
import GOT_BULK_MANAGEMENT_CONFIG from '../constants/actionTypes/config';
import LmsApiService from '../services/LmsApiService';

const startedFetchingAssignmentTypes = () => ({ type: STARTED_FETCHING_ASSIGNMENT_TYPES });
const errorFetchingAssignmentTypes = () => ({ type: ERROR_FETCHING_ASSIGNMENT_TYPES });
const gotAssignmentTypes = assignmentTypes => ({ type: GOT_ASSIGNMENT_TYPES, assignmentTypes });
const gotGradesFrozen = areGradesFrozen => ({ type: GOT_ARE_GRADES_FROZEN, areGradesFrozen });
const gotBulkManagementConfig = bulkManagementEnabled => ({
  type: GOT_BULK_MANAGEMENT_CONFIG,
  data: bulkManagementEnabled,
});

const fetchAssignmentTypes = courseId => (
  (dispatch) => {
    dispatch(startedFetchingAssignmentTypes());
    return LmsApiService.fetchAssignmentTypes(courseId)
      .then(response => response.data)
      .then((data) => {
        dispatch(gotAssignmentTypes(Object.keys(data.assignment_types)));
        dispatch(gotGradesFrozen(data.grades_frozen));
        dispatch(gotBulkManagementConfig(data.can_see_bulk_management));
      })
      .catch(() => {
        dispatch(errorFetchingAssignmentTypes());
      });
  }
);

export {
  fetchAssignmentTypes,
  startedFetchingAssignmentTypes,
  gotAssignmentTypes,
  errorFetchingAssignmentTypes,
};
