import filter from './filters';
import actions from '../actions/filters';
import gradeActions from '../actions/grades';
import initialFilters from '../constants/filters';

const initialState = {};

const expectedFilterType = 'homework';
const expectedAssignmentId = 'assignment 1';
const expectedAssignment = {
  type: expectedFilterType,
  id: expectedAssignmentId,
};
const testingState = {
  assignment: expectedAssignment,
};

describe('filter reducer group', () => {
  it('has initial state', () => {
    expect(filter(undefined, {})).toEqual(initialState);
  });

  it('filter by assignment type', () => {
    const expected = {
      ...testingState,
      assignmentType: expectedFilterType,
    };
    expect(filter(testingState, actions.update.assignmentType({
      filterType: expectedFilterType,
    }))).toEqual(expected);
  });

  it('filter on not existed assignment type', () => {
    const notExistFilter = 'not exist filter';
    const expected = {
      ...testingState,
      assignmentType: notExistFilter,
      assignment: '',
    };
    expect(filter(testingState, actions.update.assignmentType({
      filterType: notExistFilter,
    }))).toEqual(expected);
  });

  it('initialize', () => {
    const payload = {
      assignment: expectedAssignment,
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
      ...initialState,
      ...payload,
      assignment: {
        id: payload.assignment,
      },
    };
    expect(filter(undefined, actions.initialize(payload))).toEqual(expected);
  });

  it('reset', () => {
    const payload = Object.keys(initialFilters);
    expect(filter(testingState, actions.reset(payload))).toEqual(initialFilters);
  });

  it('update assignment', () => {
    const expected = {
      ...initialState,
      assignment: expectedAssignment,
    };
    expect(
      filter(initialState, actions.update.assignment(expectedAssignment)),
    ).toEqual(expected);
  });

  it('update assignment limit', () => {
    const expectedMinGrade = 50;
    const expectedMaxGrade = 100;
    const expected = {
      ...initialState,
      assignmentGradeMin: expectedMinGrade,
      assignmentGradeMax: expectedMaxGrade,
    };
    expect(
      filter(initialState, actions.update.assignmentLimits({
        minGrade: expectedMinGrade,
        maxGrade: expectedMaxGrade,
      })),
    ).toEqual(expected);
  });

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

describe('grade reducer group', () => {
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

  it('grade receive without assignment type', () => {
    const expected = {
      ...testingState,
      track: expectedTrack,
      cohort: expectedCohortId,
    };

    expect(filter(testingState, gradeActions.received({
      grades,
      track: expectedTrack,
      cohort: expectedCohortId,
    }))).toEqual(expected);
  });

  it('grade receive with assignment type', () => {
    const expected = {
      ...testingState,
      track: expectedTrack,
      cohort: expectedCohortId,
    };
    expect(filter(testingState, gradeActions.received({
      track: expectedTrack,
      cohort: expectedCohortId,
    }))).toEqual(expected);
  });
});
