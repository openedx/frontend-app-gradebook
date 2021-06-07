/* eslint-disable import/no-self-import */
import { StrictDict } from 'utils';

import actions from 'data/actions';
import selectors from 'data/selectors';
import { fetchGradeOverrideHistory } from './grades';
import { fetchRoles } from './roles';
import * as module from './app';

export const initialize = (courseId, urlQuery) => (dispatch) => {
  dispatch(actions.app.setCourseId(courseId));
  dispatch(actions.filters.initialize(urlQuery));
  dispatch(fetchRoles());
};

export const filterMenu = StrictDict({
  close: () => (dispatch, getState) => {
    if (selectors.app.filterMenu.open(getState())) {
      dispatch(module.filterMenu.toggle());
    }
  },
  handleTransitionEnd: (event) => (dispatch) => {
    if (event.currentTarget === event.target) {
      dispatch(actions.app.filterMenu.endTransition());
    }
  },
  toggle: () => (dispatch) => {
    dispatch(actions.app.filterMenu.startTransition());
    const toggleMenu = () => dispatch(actions.app.filterMenu.toggle());
    const animationCb = () => window.setTimeout(toggleMenu);
    window.requestAnimationFrame(animationCb);
  },
});

export const setModalStateFromTable = ({ userEntry, subsection }) => (
  (dispatch) => {
    dispatch(fetchGradeOverrideHistory(subsection.module_id, userEntry.user_id));
    dispatch(actions.app.setModalStateFromTable({ subsection, userEntry }));
  }
);

export default StrictDict({
  initialize,
  filterMenu,
  setModalStateFromTable,
});
