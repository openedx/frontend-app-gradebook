/* eslint-disable import/prefer-default-export */

import * as assignmentTypes from '../actions/assignmentTypes';
import * as config from '../actions/config';

import LmsApiService from '../services/LmsApiService';

const fetchAssignmentTypes = courseId => (
  (dispatch) => {
    dispatch(assignmentTypes.startedFetching());
    return LmsApiService.fetchAssignmentTypes(courseId)
      .then(response => response.data)
      .then((data) => {
        dispatch(assignmentTypes.received(Object.keys(data.assignment_types)));
        dispatch(assignmentTypes.gotGradesFrozen(data.grades_frozen));
        dispatch(config.gotBulkManagementConfig(data.can_see_bulk_management));
      })
      .catch(() => {
        dispatch(assignmentTypes.errorFetching());
      });
  }
);

export { fetchAssignmentTypes };
