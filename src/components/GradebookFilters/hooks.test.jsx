import { MockUseState } from 'testUtils';
import { actions, selectors, thunkActions } from 'data/redux/hooks';
import * as hooks from './hooks';

jest.mock('data/redux/hooks', () => ({
  actions: {
    filters: { useUpdateIncludeCourseRoleMembers: jest.fn() },
  },
  selectors: {
    filters: { useIncludeCourseRoleMembers: jest.fn() },
  },
  thunkActions: {
    app: { useCloseFilterMenu: jest.fn() },
    grades: { useFetchGrades: jest.fn() },
  },
}));

const state = new MockUseState(hooks);

selectors.filters.useIncludeCourseRoleMembers.mockReturnValue(true);
const updateIncludeCourseRoleMembers = jest.fn();
actions.filters.useUpdateIncludeCourseRoleMembers.mockReturnValue(updateIncludeCourseRoleMembers);
const closeFilterMenu = jest.fn();
thunkActions.app.useCloseFilterMenu.mockReturnValue(closeFilterMenu);
const fetchGrades = jest.fn();
thunkActions.grades.useFetchGrades.mockReturnValue(fetchGrades);

const updateQueryParams = jest.fn();

let out;
describe('GradebookFiltersData component hooks', () => {
  describe('state', () => {
    state.testGetter(state.keys.includeCourseRoleMembers);
  });
  describe('useGradebookFiltersData', () => {
    beforeEach(() => {
      state.mock();
      out = hooks.useGradebookFiltersData({ updateQueryParams });
    });
    describe('behavior', () => {
      it('initializes hooks', () => {
        expect(actions.filters.useUpdateIncludeCourseRoleMembers).toHaveBeenCalledWith();
        expect(selectors.filters.useIncludeCourseRoleMembers).toHaveBeenCalledWith();
        expect(thunkActions.app.useCloseFilterMenu).toHaveBeenCalledWith();
        expect(thunkActions.grades.useFetchGrades).toHaveBeenCalledWith();
      });
    });
    describe('output', () => {
      test('closeMenu', () => {
        expect(out.closeMenu).toEqual(closeFilterMenu);
      });
      test('includeCourseTeamMembers value', () => {
        expect(out.includeCourseTeamMembers.value).toEqual(true);
      });
      test('includeCourseTeamMembers handleChange', () => {
        const event = { target: { checked: false } };
        out.includeCourseTeamMembers.handleChange(event);
        expect(state.setState.includeCourseRoleMembers).toHaveBeenCalledWith(false);
        expect(updateIncludeCourseRoleMembers).toHaveBeenCalledWith(false);
        expect(fetchGrades).toHaveBeenCalledWith();
        expect(updateQueryParams).toHaveBeenCalledWith({ includeCourseRoleMembers: false });
      });
    });
  });
});
