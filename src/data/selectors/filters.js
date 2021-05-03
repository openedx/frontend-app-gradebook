import * as utils from '../utils';

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
  category,
  module_id: id,
}) => ({
  label, subsectionLabel, category, id,
});

const selectableAssignmentLabels = (state) => (
  selectableAssignments(state).map(chooseRelevantAssignmentData)
);

const typeOfSelectedAssignment = (state) => {
  const selectedAssignmentLabel = allFilters(state).assignment;
  const sectionBreakdown = (state.grades.results[0] || {}).section_breakdown || [];
  const selectedAssignment = sectionBreakdown.find(
    ({ label }) => label === selectedAssignmentLabel,
  );
  return selectedAssignment && selectedAssignment.category;
};

const simpleSelectors = utils.simpleSelectors(
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
  selectedAssignmentId,
  selectedAssignmentLabel,

  selectableAssignmentLabels,
  selectableAssignments,
  allFilters,
  typeOfSelectedAssignment,
  chooseRelevantAssignmentData,
  getAssignmentsFromResultsSubstate,
};

export default selectors;
