import assignmentTypes from './assignmentTypes';
import actions from '../actions/assignmentTypes';

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
    expect(assignmentTypes(undefined, actions.fetching.started()))
      .toEqual(expected);
  });

  it('updates fetch assignmentTypes success state', () => {
    const expected = {
      ...initialState,
      results: assignmentTypesData,
      errorFetching: false,
      finishedFetching: true,
    };
    expect(
      assignmentTypes(undefined, actions.fetching.received(assignmentTypesData)),
    ).toEqual(expected);
  });

  it('updates fetch assignmentTypes failure state', () => {
    const expected = {
      ...initialState,
      errorFetching: true,
      finishedFetching: true,
    };
    expect(
      assignmentTypes(undefined, actions.fetching.error()),
    ).toEqual(expected);
  });

  it('updates areGradesFrozen success state', () => {
    const expectedAreGradesFrozen = true;
    const expected = {
      ...initialState,
      errorFetching: false,
      finishedFetching: true,
      areGradesFrozen: expectedAreGradesFrozen,
    };
    expect(
      assignmentTypes(undefined, actions.gotGradesFrozen(expectedAreGradesFrozen)),
    ).toEqual(expected);
  });
});
