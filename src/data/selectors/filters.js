import simpleSelectorFactory from '../utils';

const allFilters = (state) => state.filters || {};

const getAssignmentsFromResultsSubstate = (results) => (
  (results[0] || {}).section_breakdown || []
);

const selectableAssignments = (state) => {
  const selectedAssignmentType = allFilters(state).assignmentType;
  const needToFilter = selectedAssignmentType && selectedAssignmentType !== 'All';
  const allAssignments = getAssignmentsFromResultsSubstate(state.grades.results);
  if (needToFilter) {
    return allAssignments.filter(
      (assignment) => assignment.category === selectedAssignmentType,
    );
  }
  return allAssignments;
};

const chooseRelevantAssignmentData = ({
  label,
  subsection_name: subsectionLabel,
  category: type,
  module_id: id,
}) => ({
  label, subsectionLabel, type, id,
});

const selectableAssignmentLabels = (state) => (
  selectableAssignments(state).map(chooseRelevantAssignmentData)
);

const relevantAssignmentDataFromResults = (grades, id) => (
  getAssignmentsFromResultsSubstate(grades).map(chooseRelevantAssignmentData).find(
    assignment => assignment.id === id,
  )
);

const simpleSelectors = simpleSelectorFactory(
  ({ filters }) => filters,
  [
    'assignment',
    'assignmentGradeMax',
    'assignmentGradeMin',
    'assignmentType',
    'cohort',
    'courseGradeMax',
    'courseGradeMin',
    'track',
    'includeCourseRoleMembers',
  ],
);
const selectedAssignmentId = (state) => (simpleSelectors.assignment(state) || {}).id;
const selectedAssignmentLabel = (state) => (simpleSelectors.assignment(state) || {}).label;

const selectors = {
  ...simpleSelectors,
  relevantAssignmentDataFromResults,
  selectedAssignmentId,
  selectedAssignmentLabel,
  selectableAssignmentLabels,
  selectableAssignments,
  allFilters,
  chooseRelevantAssignmentData,
  getAssignmentsFromResultsSubstate,
};

export default selectors;
