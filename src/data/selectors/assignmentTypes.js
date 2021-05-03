const selectors = {
  areGradesFrozen: ({ assignmentTypes }) => assignmentTypes.areGradesFrozen,
  allAssignmentTypes: ({ assignmentTypes }) => assignmentTypes.results,
};

export default selectors;
