import { StrictDict } from 'utils';

import actions from 'data/actions';
import { fetchGradeOverrideHistory } from './grades';
import { fetchRoles } from './roles';

export const setModalStateFromTable = ({ userEntry, subsection }) => (
  (dispatch) => {
    dispatch(fetchGradeOverrideHistory(subsection.module_id, userEntry.user_id));
    dispatch(actions.app.setModalStateFromTable({ subsection, userEntry }));
  }
);

export const initialize = (courseId, urlQuery) => (dispatch) => {
  dispatch(actions.app.setCourseId(courseId));
  dispatch(actions.filters.initialize(urlQuery));
  dispatch(fetchRoles());
};

export default StrictDict({
  initialize,
  setModalStateFromTable,
});
