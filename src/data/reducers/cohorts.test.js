import cohorts, { initialState } from './cohorts';
import actions from '../actions/cohorts';

const cohortsData = [
  { arbitraryCohortField: 'some data' },
  { anotherArbitraryCohortField: 'some data' },
];

const testingState = {
  ...initialState,
  results: cohortsData,
  arbitraryField: 'arbitrary',
};

describe('cohorts reducer', () => {
  it('has initial state', () => {
    expect(
      cohorts(undefined, {}),
    ).toEqual(initialState);
  });

  describe('handling actions.fetching.started', () => {
    it('sets startedFetching=true', () => {
      const expected = {
        ...testingState,
        startedFetching: true,
      };
      expect(
        cohorts(testingState, actions.fetching.started()),
      ).toEqual(expected);
    });
  });

  describe('handling actions.fetching.received', () => {
    it('loads results and sets finishedFetching=true and errorFetching=false', () => {
      const newCohortData = [{ newResultFields: 'recieved data' }];
      const expected = {
        ...testingState,
        results: newCohortData,
        errorFetching: false,
        finishedFetching: true,
      };
      expect(
        cohorts(testingState, actions.fetching.received(newCohortData)),
      ).toEqual(expected);
    });
  });

  describe('handling actions.fetching.error', () => {
    it('sets finishedFetching=true and errorFetching=true', () => {
      const expected = {
        ...testingState,
        errorFetching: true,
        finishedFetching: true,
      };
      expect(
        cohorts(testingState, actions.fetching.error()),
      ).toEqual(expected);
    });
  });
});
