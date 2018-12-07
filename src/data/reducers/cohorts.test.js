import cohorts from './cohorts';
import {
  STARTED_FETCHING_COHORTS,
  ERROR_FETCHING_COHORTS,
  GOT_COHORTS,
} from '../constants/actionTypes/cohorts';

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
    expect(cohorts(undefined, {
      type: STARTED_FETCHING_COHORTS,
    })).toEqual(expected);
  });

  it('updates fetch cohorts success state', () => {
    const expected = {
      ...initialState,
      results: cohortsData,
      errorFetching: false,
      finishedFetching: true,
    };
    expect(cohorts(undefined, {
      type: GOT_COHORTS,
      cohorts: cohortsData,
    })).toEqual(expected);
  });

  it('updates fetch cohorts failure state', () => {
    const expected = {
      ...initialState,
      errorFetching: true,
      finishedFetching: true,
    };
    expect(cohorts(undefined, {
      type: ERROR_FETCHING_COHORTS,
    })).toEqual(expected);
  });
});
