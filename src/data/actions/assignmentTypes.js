import {
  STARTED_FETCHING_ASSIGNMENT_TYPES,
  GOT_ASSIGNMENT_TYPES,
  ERROR_FETCHING_ASSIGNMENT_TYPES,
} from '../constants/actionTypes/assignmentTypes';
import LmsApiService from '../services/LmsApiService';

const startedFetchingAssignmentTypes = () => ({ type: STARTED_FETCHING_ASSIGNMENT_TYPES });
const errorFetchingAssignmentTypes = () => ({ type: ERROR_FETCHING_ASSIGNMENT_TYPES });
const gotAssignmentTypes = assignmentTypes => ({ type: GOT_ASSIGNMENT_TYPES, assignmentTypes });

const fetchAssignmentTypes = courseId => (
  (dispatch) => {
    dispatch(startedFetchingAssignmentTypes());
    return LmsApiService.fetchAssignmentTypes(courseId)
      .then(response => response.data)
      .then((data) => {
        dispatch(gotAssignmentTypes(Object.keys(data.assignment_types)));
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

