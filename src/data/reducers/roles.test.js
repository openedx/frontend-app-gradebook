import roles, { initialState } from './roles';
import actions from '../actions/roles';

const testingState = {
  ...initialState,
  arbitraryField: 'arbitrary',
};

describe('roles reducer', () => {
  it('has initial state', () => {
    expect(
      roles(undefined, {}),
    ).toEqual(initialState);
  });

  describe('handling actions.received', () => {
    it('updates canUserViewGradebook to the received payload', () => {
      const expectedCanUserViewGradebook = true;
      expect(
        roles(testingState, actions.fetching.received(expectedCanUserViewGradebook)),
      ).toEqual({
        ...testingState,
        canUserViewGradebook: expectedCanUserViewGradebook,
      });
    });
  });

  describe('handling actions.errorFetching', () => {
    it('sets canUserViewGradebook to false', () => {
      expect(
        roles(testingState, actions.fetching.error()),
      ).toEqual({
        ...testingState,
        canUserViewGradebook: false,
      });
    });
  });
});
