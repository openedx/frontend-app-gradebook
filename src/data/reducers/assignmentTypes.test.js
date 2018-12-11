import assignmentTypes from './assignmentTypes';
import {
  STARTED_FETCHING_ASSIGNMENT_TYPES,
  ERROR_FETCHING_ASSIGNMENT_TYPES,
  GOT_ASSIGNMENT_TYPES,
  GOT_ARE_GRADES_FROZEN,
} from '../constants/actionTypes/assignmentTypes';

const initialState = {
  results: [],
  startedFetching: false,
  errorFetching: false,
};

const assignmentTypesData = ['Exam', 'Homework'];

describe('assignmentTypes reducer', () => {
  it('has initial state', () => {
    expect(assignmentTypes(undefined, {})).toEqual(initialState);
  });

  it('updates fetch assignmentTypes request state', () => {
    const expected = {
      ...initialState,
      startedFetching: true,
    };
    expect(assignmentTypes(undefined, {
      type: STARTED_FETCHING_ASSIGNMENT_TYPES,
    })).toEqual(expected);
  });

  it('updates fetch assignmentTypes success state', () => {
    const expected = {
      ...initialState,
      results: assignmentTypesData,
      errorFetching: false,
      finishedFetching: true,
    };
    expect(assignmentTypes(undefined, {
      type: GOT_ASSIGNMENT_TYPES,
      assignmentTypes: assignmentTypesData,
    })).toEqual(expected);
  });

  it('updates fetch assignmentTypes failure state', () => {
    const expected = {
      ...initialState,
      errorFetching: true,
      finishedFetching: true,
    };
    expect(assignmentTypes(undefined, {
      type: ERROR_FETCHING_ASSIGNMENT_TYPES,
    })).toEqual(expected);
  });

  it('updates areGradesFrozen success state', () => {
    const expected = {
      ...initialState,
      errorFetching: false,
      finishedFetching: true,
      areGradesFrozen: true,
    };
    expect(assignmentTypes(undefined, {
      type: GOT_ARE_GRADES_FROZEN,
      areGradesFrozen: true,
    })).toEqual(expected);
  });
});
