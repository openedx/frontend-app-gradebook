const allCohorts = state => state.cohorts.results || [];

const getCohortById = (state, selectedCohortId) => {
  const cohort = allCohorts(state).find(coh => coh.id === selectedCohortId);
  return cohort;
};

const getCohortNameById = (state, selectedCohortId) => (getCohortById(state, selectedCohortId) || {}).name;

const selectors = {
  getCohortById,
  getCohortNameById,
  allCohorts,
};

export default selectors;
