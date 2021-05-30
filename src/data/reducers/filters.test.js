import selectors from 'data/selectors';
import filter, { initialState } from './filters';
import actions from '../actions/filters';
import gradeActions from '../actions/grades';
import initialFilters from '../constants/filters';

jest.mock('data/selectors', () => ({
  __esModule: true,
  default: {
    filters: {
      relevantAssignmentDataFromResults: jest.fn(),
    },
  },
}));

const expectedFilterType = 'homework';
const expectedAssignmentId = 'assignment 1';
const expectedAssignment = {
  type: expectedFilterType,
  id: expectedAssignmentId,
};
const testingState = {
  ...initialState,
  arbitraryField: 'arbirary',
  assignmentType: 'exam',
  assignment: { ...expectedAssignment },
};

describe('filter reducer', () => {
  it('has initial state', () => {
    expect(
      filter(undefined, {}),
    ).toEqual(initialState);
  });

  describe('handling actions.initialize', () => {
    it('replaces all passed fields', () => {
      const payload = {
        assignment: { ...expectedAssignment },
        assignmentType: expectedFilterType,
        track: 'verified',
        cohort: 5,
        assignmentGradeMin: 50,
        assignmentGradeMax: 100,
        courseGradeMin: 50,
        courseGradeMax: 100,
        includeCourseRoleMembers: true,
      };
      const action = { type: actions.initialize.toString(), payload };
      expect(filter(testingState, action)).toEqual({ ...testingState, ...payload });
    });
    it('only replaces passed fields', () => {
      const payload = { otherField: 'some data' };
      const action = { type: actions.initialize.toString(), payload };
      expect(filter(testingState, action)).toEqual({ ...testingState, ...payload });
    });
  });

  describe('handling actions.reset', () => {
    it('resets the all attribute existed in filter to initial filter', () => {
      expect(
        filter(testingState, actions.reset(Object.keys(initialFilters))),
      ).toEqual({ ...testingState, ...initialFilters });
    });
    it('only resets keys passed in the action', () => {
      const payload = ['assignment', 'assignmentType'];
      expect(filter(testingState, actions.reset(payload))).toEqual({
        ...testingState,
        [payload[0]]: initialFilters[payload[0]],
        [payload[1]]: initialFilters[payload[1]],
      });
    });
  });

  describe('handle actions.update.assignment', () => {
    it('loads assignment from payload', () => {
      expect(
        filter(testingState, actions.update.assignment(expectedAssignment)),
      ).toEqual({ ...testingState, assignment: expectedAssignment });
    });
  });

  describe('handle actions.update.assignmentLimits', () => {
    it('loads assignmentGrade[Min/Max] from payload [min/max]grade', () => {
      const expectedMinGrade = 50;
      const expectedMaxGrade = 100;
      expect(
        filter(testingState, actions.update.assignmentLimits({
          assignmentGradeMax: expectedMaxGrade,
          assignmentGradeMin: expectedMinGrade,
        })),
      ).toEqual({
        ...testingState,
        assignmentGradeMax: expectedMaxGrade,
        assignmentGradeMin: expectedMinGrade,
      });
    });
  });

  describe('handle actions.update.assignmentType', () => {
    const action = actions.update.assignmentType;
    describe('new non-empty type', () => {
      const newType = 'new ASsignment TYpe';
      it('loads assignmentType and clears assignment', () => {
        expect(
          filter(testingState, action(newType)),
        ).toEqual({
          ...testingState,
          assignmentType: newType,
          assignment: '',
        });
      });
    });
    describe('empty string type', () => {
      it('does not clear assignment if the type is empty', () => {
        expect(
          filter(testingState, action('')),
        ).toEqual({ ...testingState, assignmentType: '' });
      });
    });
    describe('matching type', () => {
      it('does not clear the assignment if the type still matches the assignment', () => {
        expect(
          filter(testingState, action(testingState.assignment.type)),
        ).toEqual({
          ...testingState,
          assignmentType: testingState.assignment.type,
        });
      });
    });
  });

  describe('handling actions.update.cohort', () => {
    it('loads cohort from payload', () => {
      const cohort = 'COHOrt';
      expect(
        filter(testingState, actions.update.cohort(cohort)),
      ).toEqual({ ...testingState, cohort });
    });
  });

  describe('handling actions.update.courseGradeLimits', () => {
    it('updates courseGrade[Min/Max]', () => {
      const payload = {
        courseGradeMin: 20,
        courseGradeMax: 70,
      };
      expect(
        filter(initialState, actions.update.courseGradeLimits(payload)),
      ).toEqual({ ...initialState, ...payload });
    });
  });

  describe('handling actions.update.includeCourseRoleMembers', () => {
    it('updates includeCourseRoleMembers from payload', () => {
      const includeCourseRoleMembers = true;
      expect(
        filter(initialState, actions.update.includeCourseRoleMembers(includeCourseRoleMembers)),
      ).toEqual({ ...initialState, includeCourseRoleMembers });
    });
  });

  describe('handling actions.update.track', () => {
    it('loads track from payload', () => {
      const track = 'traaaaack';
      expect(
        filter(testingState, actions.update.track(track)),
      ).toEqual({ ...testingState, track });
    });
  });

  describe('handling gradeActions.fetching.received', () => {
    const mockSelector = (val) => {
      selectors.filters.relevantAssignmentDataFromResults.mockImplementation(
        (...args) => ({ args, val }),
      );
    };
    const assignmentId = 'fake ID';
    const action = gradeActions.fetching.received;
    const payload = {
      cohort: 'aCohoRT',
      track: 'ATRacK',
      grades: 'someGrades',
    };
    const relevantAssignment = { relevant: 'assignment' };
    describe('with non-typed assignment filter', () => {
      const state = { ...testingState, assignment: { id: assignmentId } };
      it('loads relevant assignment data by id with track and cohort from payload', () => {
        mockSelector(relevantAssignment);
        expect(filter(state, action(payload))).toEqual({
          ...state,
          cohort: payload.cohort,
          track: payload.track,
          assignment: { args: [payload.grades, assignmentId], val: relevantAssignment },
        });
      });
    });
    describe('with empty assignment filter', () => {
      const state = { ...testingState, assignment: '' };
      it('loads cohort and track from payload', () => {
        expect(filter(state, action(payload))).toEqual({
          ...state,
          cohort: payload.cohort,
          track: payload.track,
        });
      });
    });
    describe('with typed assignment filter', () => {
      const state = { ...testingState, assignment: { id: assignmentId, type: 'homework' } };
      it('loads cohort and track from payload', () => {
        expect(filter(state, action(payload))).toEqual({
          ...state,
          cohort: payload.cohort,
          track: payload.track,
        });
      });
    });
  });
});
