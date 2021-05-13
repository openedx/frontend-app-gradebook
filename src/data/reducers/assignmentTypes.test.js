import assignmentTypes from './assignmentTypes';
import actions from '../actions/assignmentTypes';

const initialState = {
  results: [],
  startedFetching: false,
  errorFetching: false,
};

const testingState = {
  ...initialState,
  results: ['Exam', 'Homework'],
};

describe('assignmentTypes reducer', () => {
  it('has initial state', () => {
    expect(
      assignmentTypes(undefined, {}),
    ).toEqual(initialState);
  });

  it('updates fetch assignmentTypes request state', () => {
    const expected = {
      ...testingState,
      startedFetching: true,
    };
    expect(
      assignmentTypes(testingState, actions.fetching.started()),
    ).toEqual(expected);
  });

  it('updates fetch assignmentTypes success state', () => {
    const expectedResults = ['Exam'];
    const expected = {
      ...testingState,
      results: expectedResults,
      errorFetching: false,
      finishedFetching: true,
    };
    expect(
      assignmentTypes(testingState, actions.fetching.received(expectedResults)),
    ).toEqual(expected);
  });

  it('updates fetch assignmentTypes failure state', () => {
    const expected = {
      ...testingState,
      errorFetching: true,
      finishedFetching: true,
    };
    expect(
      assignmentTypes(testingState, actions.fetching.error()),
    ).toEqual(expected);
  });

  it('updates areGradesFrozen success state', () => {
    const expectedAreGradesFrozen = true;
    const expected = {
      ...testingState,
      errorFetching: false,
      finishedFetching: true,
      areGradesFrozen: expectedAreGradesFrozen,
    };
    expect(
      assignmentTypes(testingState, actions.gotGradesFrozen(expectedAreGradesFrozen)),
    ).toEqual(expected);
  });
});
