import { INITIALIZE_FILTERS, UPDATE_ASSIGNMENT_FILTER, UPDATE_ASSIGNMENT_LIMITS } from '../constants/actionTypes/filters';

const initializeFilters = ({
  assignment = '',
  assignmentType = '',
  track = '',
  cohort = '',
  assignmentGradeMin = '',
  assignmentGradeMax = '',
}) => ({
  type: INITIALIZE_FILTERS,
  data: {
    assignment: { id: assignment },
    assignmentType,
    track,
    cohort,
    assignmentGradeMin,
    assignmentGradeMax,
  },
});

const updateAssignmentFilter = assignment => ({
  type: UPDATE_ASSIGNMENT_FILTER,
  data: assignment,
});

const updateAssignmentLimits = (minGrade, maxGrade) => ({
  type: UPDATE_ASSIGNMENT_LIMITS,
  data: { minGrade, maxGrade },
});

export { initializeFilters, updateAssignmentFilter, updateAssignmentLimits };
