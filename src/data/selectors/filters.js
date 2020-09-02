const getFilters = state => state.filters || {};

const getAssignmentsFromResultsSubstate = results => (results[0] || {}).section_breakdown || [];

const selectableAssignments = (state) => {
  const selectedAssignmentType = getFilters(state).assignmentType;
  const needToFilter = selectedAssignmentType && selectedAssignmentType !== 'All';
  const allAssignments = getAssignmentsFromResultsSubstate(state.grades.results);
  if (needToFilter) {
    return allAssignments.filter(assignment => assignment.category === selectedAssignmentType);
  }
  return allAssignments;
};

const chooseRelevantAssignmentData = assignment => ({
  label: assignment.label,
  subsectionLabel: assignment.subsection_name,
  type: assignment.category,
  id: assignment.module_id,
});

const selectableAssignmentLabels = state => selectableAssignments(state).map(chooseRelevantAssignmentData);

const typeOfSelectedAssignment = (state) => {
  const selectedAssignmentLabel = getFilters(state).assignment;
  const sectionBreakdown = (state.grades.results[0] || {}).section_breakdown || [];
  const selectedAssignment = sectionBreakdown.find(section => section.label === selectedAssignmentLabel);
  return selectedAssignment && selectedAssignment.category;
};

export {
  selectableAssignmentLabels,
  selectableAssignments,
  getFilters,
  typeOfSelectedAssignment,
  chooseRelevantAssignmentData,
  getAssignmentsFromResultsSubstate,
};
