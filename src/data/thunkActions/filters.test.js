import selectors from '../selectors';
import actions from '../actions';
import { fetchGrades } from './grades';
import { updateIncludeCourseRoleMembers } from './filters';

jest.mock('./grades', () => ({
  fetchGrades: jest.fn((...args) => ({ type: 'fetchGrades', args })),
}));

jest.mock('../selectors', () => ({
  __esModule: true,
  default: {
    grades: { courseId: jest.fn() },
    filters: { allFilters: jest.fn() },
  },
}));

describe('filters thunkActions', () => {
  describe('updateIncludeCourseRoleMembers', () => {
    const getState = () => ({});
    const testVal = 'Hawaii';
    const filters = {
      cohort: 'COHort',
      track: 'TRacK',
      assignmentType: 'Prague',
    };
    const courseId = 'Some Course ID';
    let dispatch;
    beforeEach(() => {
      dispatch = jest.fn();
      selectors.filters.allFilters.mockReturnValue(filters);
      selectors.grades.courseId.mockReturnValue(courseId);
      updateIncludeCourseRoleMembers(testVal)(dispatch, getState);
    });
    it('dispatches filters.update.includeCoruseRoleMembers with passed value', () => {
      expect(dispatch.mock.calls[0][0]).toEqual(actions.filters.update.includeCourseRoleMembers(testVal));
    });
    it('dispatches fetchGrades with courseId, cohort, track, and assignmentType', () => {
      expect(dispatch.mock.calls[1][0]).toEqual(fetchGrades(
        courseId,
        filters.cohort,
        filters.track,
        filters.assignmentType,
      ));
    });
  });
});
