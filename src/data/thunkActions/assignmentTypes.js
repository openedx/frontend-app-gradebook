/* eslint-disable import/prefer-default-export */
import { StrictDict } from 'utils';

import lms from 'data/services/lms';
import actions from 'data/actions';

import { fetchBulkUpgradeHistory } from './grades';

const {
  assignmentTypes: { fetching, gotGradesFrozen },
  config: { gotBulkManagementConfig },
} = actions;

export const fetchAssignmentTypes = () => (
  (dispatch) => {
    dispatch(fetching.started());
    return lms.api.fetch.assignmentTypes()
      .then(response => response.data)
      .then((data) => {
        dispatch(fetching.received(Object.keys(data.assignment_types)));
        dispatch(gotGradesFrozen(data.grades_frozen));
        dispatch(gotBulkManagementConfig(data.can_see_bulk_management));
        if (data.can_see_bulk_management) {
          dispatch(fetchBulkUpgradeHistory());
        }
      })
      .catch(() => {
        dispatch(fetching.error());
      });
  }
);

export default StrictDict({ fetchAssignmentTypes });
