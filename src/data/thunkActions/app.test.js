import actions from 'data/actions';
import selectors from 'data/selectors';

import * as thunkActions from './app';
import { fetchGradeOverrideHistory } from './grades';
import { fetchRoles } from './roles';

jest.mock('./grades', () => ({
  fetchGradeOverrideHistory: jest.fn((...args) => ({ type: 'fetchGradeOverrideHistory', args })),
}));
jest.mock('./roles', () => ({
  fetchRoles: jest.fn(() => ({ type: 'fetchRoles' })),
}));
jest.mock('data/selectors', () => ({
  __esModule: true,
  default: {
    app: {
      filterMenu: {
        open: jest.fn(state => ({ menuOpen: state })),
      },
    },
  },
}));

describe('app thunkActions', () => {
  describe('setModalStateFromTable', () => {
    it('dispatches fetchGradeOverrideHistory for the module and setModalStateFromTable', () => {
      const dispatch = jest.fn();
      const userEntry = { user_id: 'Jenova' };
      const subsection = { module_id: 'Mako Reactor' };
      thunkActions.setModalStateFromTable({ userEntry, subsection })(dispatch);
      expect(dispatch.mock.calls[0]).toEqual([
        fetchGradeOverrideHistory(subsection.module_id, userEntry.user_id),
      ]);
      expect(dispatch.mock.calls[1]).toEqual([
        actions.app.setModalStateFromTable({ subsection, userEntry }),
      ]);
    });
  });
  describe('filterMenu', () => {
    describe('close', () => {
      it('calls filterMenu.toggle iff menu is open', () => {
        const { toggle } = thunkActions.filterMenu;
        const dispatch = jest.fn();
        thunkActions.filterMenu.toggle = jest.fn(() => ({ type: 'filterMenuToggle' }));
        selectors.app.filterMenu.open.mockReturnValue(false);
        thunkActions.filterMenu.close()(dispatch, jest.fn());
        expect(dispatch).not.toHaveBeenCalled();
        selectors.app.filterMenu.open.mockReturnValue(true);
        thunkActions.filterMenu.close()(dispatch, jest.fn());
        expect(dispatch).toHaveBeenCalledWith(thunkActions.filterMenu.toggle());
        thunkActions.filterMenu.toggle = toggle;
      });
    });
    describe('handleTransitionEnd', () => {
      it('ends filterMenu transition iff event target has not changed', () => {
        const dispatch = jest.fn();
        thunkActions.filterMenu.handleTransitionEnd({ target: 1, currentTarget: 2 })(dispatch);
        expect(dispatch).not.toHaveBeenCalled();
        thunkActions.filterMenu.handleTransitionEnd({ target: 1, currentTarget: 1 })(dispatch);
        expect(dispatch).toHaveBeenCalled();
      });
    });
    describe('toggle', () => {
      it('starts transition and toggles on timeout at next animation frame', () => {
        const dispatch = jest.fn(action => ({ dispatch: action }));
        const reqAnimFrame = window.requestAnimationFrame;
        const { setTimeout } = window;
        window.requestAnimationFrame = jest.fn();
        window.setTimeout = jest.fn(fn => ({ setTimeout: fn() }));
        thunkActions.filterMenu.toggle()(dispatch);
        expect(dispatch).toHaveBeenCalled();
        expect(dispatch.mock.calls[0][0]).toEqual(actions.app.filterMenu.startTransition());
        const animCb = window.requestAnimationFrame.mock.calls[0][0];
        expect(animCb()).toEqual({ setTimeout: dispatch(actions.app.filterMenu.toggle()) });
        expect(dispatch.mock.calls[1][0]).toEqual(actions.app.filterMenu.toggle());
        window.requestAnimationFrame = reqAnimFrame;
        window.setTimeout = setTimeout;
      });
    });
  });
  describe('initialize', () => {
    it('loads course id, and initailzes filters from urlQuery before fetching roles', () => {
      const courseId = 'an ID';
      const urlQuery = { do: 'you', wanna: 'build', a: 'snowman' };
      const dispatch = jest.fn();
      thunkActions.initialize(courseId, urlQuery)(dispatch);
      expect(dispatch.mock.calls[0]).toEqual([actions.app.setCourseId(courseId)]);
      expect(dispatch.mock.calls[1]).toEqual([actions.filters.initialize(urlQuery)]);
      expect(dispatch.mock.calls[2]).toEqual([fetchRoles()]);
    });
  });
});
