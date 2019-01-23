import roles from './roles';
import {
  ERROR_FETCHING_ROLES,
  GOT_ROLES,
} from '../constants/actionTypes/roles';

const initialState = {
  canUserViewGradebook: null,
};

describe('tracks reducer', () => {
  it('has initial state', () => {
    expect(roles(undefined, {})).toEqual(initialState);
  });

  it('updates canUserViewGradebook to true', () => {
    const expected = {
      ...initialState,
      canUserViewGradebook: true,
    };
    expect(roles(undefined, {
      type: GOT_ROLES,
      canUserViewGradebook: true,
    })).toEqual(expected);
  });

  it('updates canUserViewGradebook to false', () => {
    const expected = {
      ...initialState,
      canUserViewGradebook: false,
    };
    expect(roles(undefined, {
      type: GOT_ROLES,
      canUserViewGradebook: false,
    })).toEqual(expected);
  });

  it('updates fetch roles failure state', () => {
    const expected = {
      ...initialState,
      canUserViewGradebook: false,
    };
    expect(roles(undefined, {
      type: ERROR_FETCHING_ROLES,
    })).toEqual(expected);
  });
});
