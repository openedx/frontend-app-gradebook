/* eslint-disable import/prefer-default-export */
import { StrictDict } from '@src/utils';

import lms from '@src/data/services/lms';
import actions from '@src/data/actions';

import { fetchBulkUpgradeHistory } from './grades';

const {
  assignmentTypes: { fetching, gotGradesFrozen },
  config: { gotBulkManagementConfig },
} = actions;

export const fetchAssignmentTypes = () => (
  (dispatch) => {
    dispatch(fetching.started());
    return lms.api.fetch.assignmentTypes()
      .then(({ data }) => {
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
