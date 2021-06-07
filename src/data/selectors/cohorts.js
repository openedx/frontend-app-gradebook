/* eslint-disable import/no-self-import */
import { StrictDict } from 'utils';
import * as module from './cohorts';

/**
 * allCohorts(state)
 * returns top-level cohorts results data
 * @param {object} state - redux state
 * @return {object[]} - list of cohort objects from fetch results
 */
export const allCohorts = (state) => state.cohorts.results || [];

/**
 * getCohortById(state, selectedCohortId)
 * returns cohort with given id
 * @param {object} state - redux state
 * @param {number} selectedCohortId - id of cohort to return
 * @return {object} cohort with given id.
 */
export const getCohortById = (state, selectedCohortId) => {
  const cohort = module.allCohorts(state).find(({ id }) => id === selectedCohortId);
  return cohort;
};

/**
 * getCohortNameById(state, selectedCohortId)
 * return name of cohort with given id
 * @param {object} state - redux state
 * @param {number} selectedCohortId - id of cohort whose name is requested
 * @return {string} - name of cohort with the given id
 */
const getCohortNameById = (state, selectedCohortId) => (
  module.getCohortById(state, selectedCohortId) || {}
).name;

/**
 * cohortsByName(state)
 * returns an object of all cohorts keyed by name
 * @param {object} state - redux state
 * @return {object} - all cohorts, keyed by name
 */
const cohortsByName = (state) => module.allCohorts(state).reduce(
  (obj, cohort) => ({ ...obj, [cohort.name]: cohort }),
  {},
);

export default StrictDict({
  cohortsByName,
  getCohortById,
  getCohortNameById,
  allCohorts,
});
