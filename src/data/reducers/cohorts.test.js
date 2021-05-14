import cohorts, { initialState } from './cohorts';
import actions from '../actions/cohorts';

const cohortsData = [
  {
    assignment_type: 'manual',
    group_id: null,
    id: 1,
    name: 'default_group',
    user_count: 2,
    user_partition_id: null,
  },
  {
    assignment_type: 'auto',
    group_id: null,
    id: 2,
    name: 'auto_group',
    user_count: 5,
    user_partition_id: null,
  }];

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
            assignment_type: 'manual',
            group_id: null,
            id: 3,
            name: 'default_group',
            user_count: 3,
            user_partition_id: null,
          },
          {
            assignment_type: 'auto',
            group_id: null,
            id: 4,
            name: 'auto_group',
            user_count: 6,
            user_partition_id: null,
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
