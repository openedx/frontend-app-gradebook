/* eslint-disable import/no-named-as-default-member */
import * as selectors from './cohorts';
import exportedSelectors from './cohorts';

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

const nonMatchingId = '9001';

const testState = { cohorts: { results: testCohorts } };

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

describe('cohortsByName', () => {
  it('returns all cohorts, grouped by name', () => {
    expect(exportedSelectors.cohortsByName(testState)).toEqual({
      [testCohorts[0].name]: testCohorts[0],
      [testCohorts[1].name]: testCohorts[1],
    });
  });
  it('returns an empty object if there are no cohorts in results', () => {
    expect(exportedSelectors.cohortsByName({ cohorts: {} })).toEqual({});
  });
});

describe('getCohortById', () => {
  it('returns cohort when a match is found', () => {
    const cohort = selectors.getCohortById(testState, testCohorts[0].id);
    expect(cohort).toEqual(testCohorts[0]);
  });
  it('returns undefined when no match is found', () => {
    const cohort = selectors.getCohortById(testState, nonMatchingId);
    expect(cohort).toEqual(undefined);
  });
});

describe('getCohortNameById', () => {
  it('returns a cohort name when cohort matching ID is found', () => {
    const cohortName = exportedSelectors.getCohortNameById(testState, testCohorts[1].id);
    expect(cohortName).toEqual(testCohorts[1].name);
  });
  it('returns undefined when no matching cohort is found', () => {
    const cohortName = exportedSelectors.getCohortNameById(testState, nonMatchingId);
    expect(cohortName).toEqual(undefined);
  });
});
