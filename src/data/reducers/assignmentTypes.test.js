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

  describe('handling action fetching', () => {
    describe('handling actions.fetching.started', () => {
      it('only change startedFetching attribute to true. Preserve result if existed.', () => {
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
      it('replace the results then make finished fetching true and error fetching false', () => {
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
      it('make error fetching true and finished fetching true. Preserve result if existed.', () => {
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
  });

  describe('handling actions.gotGradesFrozen', () => {
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
});
