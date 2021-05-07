import selectors from './assignmentTypes';

describe('areGradesFrozen', () => {
  it('selects areGradesFrozen from state', () => {
    const testValue = 'THX 1138';
    const areGradesFrozen = selectors.areGradesFrozen({ assignmentTypes: { areGradesFrozen: testValue } });
    expect(areGradesFrozen).toEqual(testValue);
  });
});

describe('allAssignmentTypes', () => {
  it('returns assignment types', () => {
    const testAssignmentTypes = ['assignment', 'labs'];
    const allAssignmentTypes = selectors.allAssignmentTypes({ assignmentTypes: { results: testAssignmentTypes } });
    expect(allAssignmentTypes).toEqual(testAssignmentTypes);
  });
});
