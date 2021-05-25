import selectors from './assignmentTypes';

describe('assignmentType selectors', () => {
  describe('areGradesFrozen', () => {
    it('selects areGradesFrozen from state', () => {
      const testValue = 'THX 1138';
      expect(
        selectors.areGradesFrozen({ assignmentTypes: { areGradesFrozen: testValue } }),
      ).toEqual(testValue);
    });
  });

  describe('allAssignmentTypes', () => {
    it('returns assignment types', () => {
      const testAssignmentTypes = ['assignment', 'labs'];
      expect(
        selectors.allAssignmentTypes({ assignmentTypes: { results: testAssignmentTypes } }),
      ).toEqual(testAssignmentTypes);
    });
  });
});
