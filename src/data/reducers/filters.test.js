import filter, { initialState } from './filters';
import actions from '../actions/filters';
import gradeActions from '../actions/grades';
import initialFilters from '../constants/filters';

const expectedFilterType = 'homework';
const expectedAssignmentId = 'assignment 1';
const expectedAssignment = {
  type: expectedFilterType,
  id: expectedAssignmentId,
};
const testingState = {
  ...initialState,
  arbitraryField: 'arbirary',
  assignment: { ...expectedAssignment },
};

describe('filter reducer', () => {
  it('has initial state', () => {
    expect(
      filter(undefined, {}),
    ).toEqual(initialState);
  });

  describe('handling actions.initialize', () => {
    it('replace existing state with the payload', () => {
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
      const expected = {
        ...testingState,
        ...payload,
        assignment: { id: { ...expectedAssignment } },
      };
      expect(
        filter(testingState, actions.initialize(payload)),
      ).toEqual(expected);
    });
  });

  describe('handling actions.reset', () => {
    it('reset the all attribute existed in filter to initial filter', () => {
      const payload = Object.keys(initialFilters);
      const expected = {
        ...testingState,
        ...initialFilters,
      };
      expect(
        filter(testingState, actions.reset(payload)),
      ).toEqual(expected);
    });
  });

  describe('handle actions.update.assignmentType', () => {
    it('get assignments for filtering with exist assignment type', () => {
      const expected = {
        ...testingState,
        assignmentType: expectedFilterType,
      };
      expect(
        filter(testingState, actions.update.assignmentType({
          filterType: expectedFilterType,
        })),
      ).toEqual(expected);
    });

    it('clear the assignment if assignment type not existed', () => {
      const notExistFilter = 'not exist filter';
      const expected = {
        ...testingState,
        assignmentType: notExistFilter,
        assignment: '',
      };
      expect(
        filter(testingState, actions.update.assignmentType({
          filterType: notExistFilter,
        })),
      ).toEqual(expected);
    });
  });

  describe('handle actions.update.assignment', () => {
    it('update assignment', () => {
      const expected = {
        ...testingState,
        assignment: expectedAssignment,
      };
      expect(
        filter(testingState, actions.update.assignment(expectedAssignment)),
      ).toEqual(expected);
    });
  });

  describe('handle actions.update.assignmentLimits', () => {
    it('update assignment limit', () => {
      const expectedMinGrade = 50;
      const expectedMaxGrade = 100;
      const expected = {
        ...testingState,
        assignmentGradeMin: expectedMinGrade,
        assignmentGradeMax: expectedMaxGrade,
      };
      expect(
        filter(testingState, actions.update.assignmentLimits({
          minGrade: expectedMinGrade,
          maxGrade: expectedMaxGrade,
        })),
      ).toEqual(expected);
    });
  });

  describe('handling actions.update.courseGradeLimits', () => {
    it('update grade limit', () => {
      const expectedCourseMinGrade = 50;
      const expectedCourseMaxGrade = 100;
      const expected = {
        ...initialState,
        courseGradeMin: expectedCourseMinGrade,
        courseGradeMax: expectedCourseMaxGrade,
      };
      expect(
        filter(initialState, actions.update.courseGradeLimits({
          courseGradeMin: expectedCourseMinGrade,
          courseGradeMax: expectedCourseMaxGrade,
        })),
      ).toEqual(expected);
    });
  });

  describe('handling actions.update.includeCourseRoleMembers', () => {
    it('update include course role members', () => {
      const expectedIncludeCourseRoleMembers = true;
      const expected = {
        ...initialState,
        includeCourseRoleMembers: expectedIncludeCourseRoleMembers,
      };
      expect(
        filter(initialState,
          actions.update.includeCourseRoleMembers(expectedIncludeCourseRoleMembers)),
      ).toEqual(expected);
    });
  });

  describe('handling gradeActions.received', () => {
    const expectedTrack = 'verified';
    const expectedCohortId = 5;
    const grades = [
      {
        section_breakdown: [
          {
            subsection_name: 'Demo Course Overview',
            category: expectedAssignment,
            module_id: expectedAssignmentId,
          },
          {
            subsection_name: 'Example Week 1: Getting Started',
            category: expectedAssignment,
            module_id: expectedAssignmentId,
          },
        ],
      },
    ];

    describe('handling gradeActions.received', () => {
      it('without assignment type. replace grades, track, cohort from the payload', () => {
        const expected = {
          ...testingState,
          track: expectedTrack,
          cohort: expectedCohortId,
        };

        expect(
          filter(testingState, gradeActions.received({
            grades,
            track: expectedTrack,
            cohort: expectedCohortId,
          })),
        ).toEqual(expected);
      });

      it('with assignment type. Preserve grade if existed and replace track, cohort from the payload', () => {
        const expected = {
          ...testingState,
          track: expectedTrack,
          cohort: expectedCohortId,
        };
        expect(
          filter(testingState, gradeActions.received({
            track: expectedTrack,
            cohort: expectedCohortId,
          })),
        ).toEqual(expected);
      });
    });
  });
});
