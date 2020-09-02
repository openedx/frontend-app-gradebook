const getCohorts = state => state.cohorts.results || [];

const getCohortById = (state, selectedCohortId) => {
  const cohort = getCohorts(state).find(coh => coh.id === selectedCohortId);
  return cohort;
};

const getCohortNameById = (state, selectedCohortId) => (getCohortById(state, selectedCohortId) || {}).name;

export { getCohortById, getCohortNameById, getCohorts };
