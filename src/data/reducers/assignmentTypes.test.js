import assignmentTypes, { initialState } from './assignmentTypes';
import actions from '../actions/assignmentTypes';

const testingState = {
  ...initialState,
  results: ['Exam', 'Homework'],
  arbitraryField: 'arbitrary',
};

describe('assignmentTypes reducer', () => {
  it('has initial state', () => {
    expect(
      assignmentTypes(undefined, {}),
    ).toEqual(initialState);
  });

  describe('handling actions.fetching.started', () => {
    it('sets startedFetching=true', () => {
      const expected = {
        ...testingState,
        startedFetching: true,
      };
      expect(
        assignmentTypes(testingState, actions.fetching.started()),
      ).toEqual(expected);
    });
  });

  describe('handling actions.fetching.received', () => {
    it('loads the results and sets finishedFetching=true and errorFetching=false', () => {
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
  });

  describe('handling actions.fetching.error', () => {
    it('sets errorFetching=true and finishedFetching=true', () => {
      const expected = {
        ...testingState,
        errorFetching: true,
        finishedFetching: true,
      };
      expect(
        assignmentTypes(testingState, actions.fetching.error()),
      ).toEqual(expected);
    });
  });

  describe('handling actions.gotGradesFrozen', () => {
    it('loads areGradesFrozen and sets errorFetching=false and finishedFetching=true', () => {
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
});
