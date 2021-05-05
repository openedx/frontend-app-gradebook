import selectors from './cohorts';

const testCohorts = [
  {
    id: '1',
    name: 'Cohort 1',
  },
  {
    id: '9000',
    name: 'Cohort 9000',
  },
];

const testState = { cohorts: { results: testCohorts } };

describe('getCohortById', () => {
  it('returns cohort when a match is found', () => {
    const cohort = selectors.getCohortById(testState, '1');
    expect(cohort).toEqual(testCohorts[0]);
  });
  it('returns undefined when no match is found', () => {
    const cohort = selectors.getCohortById(testState, '9001');
    expect(cohort).toEqual(undefined);
  });
});

describe('getCohortNameById', () => {
  it('returns a cohort name when cohort matching ID is found', () => {
    const cohortName = selectors.getCohortNameById(testState, '9000');
    expect(cohortName).toEqual('Cohort 9000');
  });
  it('returns undefined when no matching cohort is found', () => {
    const cohortName = selectors.getCohortNameById(testState, '9001');
    expect(cohortName).toEqual(undefined);
  });
});

describe('allCohorts', () => {
  it('selects cohorts from state', () => {
    const allCohorts = selectors.allCohorts(testState);
    expect(allCohorts).toEqual(testCohorts);
  });
  it('returns an empty array when no cohort results present in state', () => {
    const allCohorts = selectors.allCohorts({ cohorts: {} });
    expect(allCohorts).toEqual([]);
  });
});
