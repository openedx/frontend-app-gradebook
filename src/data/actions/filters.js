import { INITIALIZE_FILTERS, UPDATE_ASSIGNMENT_FILTER, UPDATE_ASSIGNMENT_LIMITS, UPDATE_COURSE_GRADE_LIMITS } from '../constants/actionTypes/filters';

const initializeFilters = ({
  assignment = '',
  assignmentType = '',
  track = '',
  cohort = '',
  assignmentGradeMin = '0',
  assignmentGradeMax = '100',
  courseGradeMin = '0',
  courseGradeMax = '100',
}) => ({
  type: INITIALIZE_FILTERS,
  data: {
    assignment: { id: assignment },
    assignmentType,
    track,
    cohort,
    assignmentGradeMin,
    assignmentGradeMax,
    courseGradeMin,
    courseGradeMax,
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

const updateCourseGradeFilter = (courseGradeMin, courseGradeMax) => ({
  type: UPDATE_COURSE_GRADE_LIMITS,
  data: {
    courseGradeMin,
    courseGradeMax,
  },
});

export {
  initializeFilters, updateAssignmentFilter,
  updateAssignmentLimits, updateCourseGradeFilter,
};
