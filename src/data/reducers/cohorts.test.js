import cohorts, { initialState } from './cohorts';
import actions from '../actions/cohorts';

const cohortsData = [
  {
    arbitraryCohortField: 'some data',
  },
  {
    anotherArbitraryCohortField: 'some data',
  },
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

  describe('fetch corhors state', () => {
    describe('handling actions.fetching.started', () => {
      it('change started fetching to true and preserve existing result', () => {
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
      it('set finish fetch to true and error to false then replace results', () => {
        const newCohortData = [
          {
            newResultFields: 'recieved data',
          },
        ];
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
      it('set finish fetch and error fetch to true. Perserve result if existed', () => {
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
});
