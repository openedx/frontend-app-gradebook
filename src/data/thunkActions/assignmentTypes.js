/* eslint-disable import/prefer-default-export */
import { StrictDict } from 'utils';
import actions from 'data/actions';
import selectors from 'data/selectors';
import LmsApiService from 'data/services/LmsApiService';

const { fetching, gotGradesFrozen } = actions.assignmentTypes;
const { gotBulkManagementConfig } = actions.config;

export const fetchAssignmentTypes = () => (
  (dispatch, getState) => {
    dispatch(fetching.started());
    return LmsApiService.fetchAssignmentTypes(selectors.app.courseId(getState()))
      .then(response => response.data)
      .then((data) => {
        dispatch(fetching.received(Object.keys(data.assignment_types)));
        dispatch(gotGradesFrozen(data.grades_frozen));
        dispatch(gotBulkManagementConfig(data.can_see_bulk_management));
      })
      .catch(() => {
        dispatch(fetching.error());
      });
  }
);

export default StrictDict({ fetchAssignmentTypes });
