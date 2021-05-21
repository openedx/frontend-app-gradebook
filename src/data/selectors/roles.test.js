import selectors from './roles';

describe('roles selectors', () => {
  describe('canUserViewGradebook', () => {
    it('returns true if the user has the canUserViewGradebook role', () => {
      const canUserViewGradebook = selectors.canUserViewGradebook({
        roles: {
          canUserViewGradebook: true,
          canUserDoTheMonsterMash: false,
        },
      });
      expect(canUserViewGradebook).toBeTruthy();
    });

    it('returns false if the user does not have the canUserViewGradebook role', () => {
      const canUserViewGradebook = selectors.canUserViewGradebook({
        roles: {
          canUserViewGradebook: false,
          canUserDoTheMonsterMash: true,
        },
      });
      expect(canUserViewGradebook).toBeFalsy();
    });
  });
});
