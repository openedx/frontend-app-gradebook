import roles, { initialState } from './roles';
import actions from '../actions/roles';

const testingState = {
  ...initialState,
  arbitraryField: 'arbitrary',
};

describe('tracks reducer', () => {
  it('has initial state', () => {
    expect(
      roles(undefined, {}),
    ).toEqual(initialState);
  });

  describe('handling actions.received', () => {
    it('updates canUserViewGradebook to the received payload', () => {
      const expectedCanUserViewGradebook = true;
      const expected = {
        ...testingState,
        canUserViewGradebook: expectedCanUserViewGradebook,
      };
      expect(
        roles(testingState, actions.received(expectedCanUserViewGradebook)),
      ).toEqual(expected);
    });
  });

  describe('handling actions.errorFetching', () => {
    it('set canUserViewGradebook to false on failure', () => {
      const expected = {
        ...testingState,
        canUserViewGradebook: false,
      };
      expect(
        roles(testingState, actions.errorFetching()),
      ).toEqual(expected);
    });
  });
});
