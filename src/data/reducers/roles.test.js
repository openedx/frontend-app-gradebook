import roles from './roles';
import actions from '../actions/roles';

const initialState = {
  canUserViewGradebook: null,
};

describe('tracks reducer', () => {
  it('has initial state', () => {
    expect(
      roles(undefined, {}),
    ).toEqual(initialState);
  });

  it('updates canUserViewGradebook to true', () => {
    const expected = {
      ...initialState,
      canUserViewGradebook: true,
    };
    expect(
      roles(undefined, actions.received(true)),
    ).toEqual(expected);
  });

  it('updates canUserViewGradebook to false', () => {
    const expected = {
      ...initialState,
      canUserViewGradebook: false,
    };
    expect(
      roles(undefined, actions.received(false)),
    ).toEqual(expected);
  });

  it('updates fetch roles failure state', () => {
    const expected = {
      ...initialState,
      canUserViewGradebook: false,
    };
    expect(
      roles(undefined, actions.errorFetching()),
    ).toEqual(expected);
  });
});
