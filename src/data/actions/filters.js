import { INITIALIZE_FILTERS, UPDATE_ASSIGNMENT_FILTER } from '../constants/actionTypes/filters';

const initializeFilters = ({
  assignment = '',
  assignmentType = '',
  track = '',
  cohort = '',
}) => ({
  type: INITIALIZE_FILTERS,
  data: {
    assignment: { label: assignment },
    assignmentType,
    track,
    cohort,
  },
});

const updateAssignmentFilter = assignment => ({
  type: UPDATE_ASSIGNMENT_FILTER,
  data: assignment,
});

export { initializeFilters, updateAssignmentFilter };
