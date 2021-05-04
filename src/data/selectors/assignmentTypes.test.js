import selectors from './assignmentTypes';

describe('areGradesFrozen', () => {
  it('returns whether grades are frozen', () => {
    let areGradesFrozen = selectors.areGradesFrozen({ assignmentTypes: { areGradesFrozen: true } });
    expect(areGradesFrozen).toBeTruthy();

    areGradesFrozen = selectors.areGradesFrozen({ assignmentTypes: { areGradesFrozen: false } });
    expect(areGradesFrozen).toBeFalsy();
  });
});

describe('allAssignmentTypes', () => {
  it('returns assignment types', () => {
    const allAssignmentTypes = selectors.allAssignmentTypes({ assignmentTypes: { results: ['assignment', 'labs'] } });
    expect(allAssignmentTypes).toEqual(['assignment', 'labs']);
  });
});
