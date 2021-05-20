/**
 * allCohorts(state)
 * returns top-level cohorts results data
 * @param {object} state - redux state
 * @return {object[]} - list of cohort objects from fetch results
 */
const allCohorts = (state) => state.cohorts.results || [];

/**
 * getCohortById(state, selectedCohortId)
 * returns cohort with given id
 * @param {object} state - redux state
 * @param {number} selectedCohortId - id of cohort to return
 * @return {object} cohort with given id.
 */
const getCohortById = (state, selectedCohortId) => {
  const cohort = allCohorts(state).find(({ id }) => id === selectedCohortId);
  return cohort;
};

/**
 * getCohortNameById(state, selectedCohortId)
 * @param {object} state - redux state
 * @param {number} selectedCohortId - id of cohort whose name is requested
 * @return {string} - name of cohort with the given id
 */
const getCohortNameById = (state, selectedCohortId) => (getCohortById(state, selectedCohortId) || {}).name;

const selectors = {
  getCohortById,
  getCohortNameById,
  allCohorts,
};

export default selectors;
