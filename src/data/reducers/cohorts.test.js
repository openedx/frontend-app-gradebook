import cohorts from './cohorts';
import actions from '../actions/cohorts';

const initialState = {
  results: [],
  startedFetching: false,
  errorFetching: false,
};

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

describe('cohorts reducer', () => {
  it('has initial state', () => {
    expect(cohorts(undefined, {})).toEqual(initialState);
  });

  it('updates fetch cohorts request state', () => {
    const expected = {
      ...initialState,
      startedFetching: true,
    };
    expect(
      cohorts(undefined, actions.fetching.started()),
    ).toEqual(expected);
  });

  it('updates fetch cohorts success state', () => {
    const expected = {
      ...initialState,
      results: cohortsData,
      errorFetching: false,
      finishedFetching: true,
    };
    expect(
      cohorts(undefined, actions.fetching.received(cohortsData)),
    ).toEqual(expected);
  });

  it('updates fetch cohorts failure state', () => {
    const expected = {
      ...initialState,
      errorFetching: true,
      finishedFetching: true,
    };
    expect(
      cohorts(undefined, actions.fetching.error()),
    ).toEqual(expected);
  });
});
