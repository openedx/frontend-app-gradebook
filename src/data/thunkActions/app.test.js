import actions from 'data/actions';
import * as thunkActions from './app';
import { fetchGradeOverrideHistory } from './grades';
import { fetchRoles } from './roles';

jest.mock('./grades', () => ({
  fetchGradeOverrideHistory: jest.fn((...args) => ({ type: 'fetchGradeOverrideHistory', args })),
}));
jest.mock('./roles', () => ({
  fetchRoles: jest.fn(() => ({ type: 'fetchRoles' })),
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
