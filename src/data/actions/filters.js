import initialFilters from '../constants/filters';
import {
  INITIALIZE_FILTERS, RESET_FILTERS, UPDATE_ASSIGNMENT_FILTER, UPDATE_ASSIGNMENT_LIMITS, UPDATE_COURSE_GRADE_LIMITS,
} from '../constants/actionTypes/filters';

const initializeFilters = ({
  assignment = initialFilters.assignment,
  assignmentType = initialFilters.assignmentType,
  track = initialFilters.track,
  cohort = initialFilters.cohort,
  assignmentGradeMin = initialFilters.assignmentGradeMin,
  assignmentGradeMax = initialFilters.assignmentGradeMax,
  courseGradeMin = initialFilters.courseGradeMin,
  courseGradeMax = initialFilters.assignmentGradeMax,
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

const resetFilters = filterNames => ({
  type: RESET_FILTERS,
  filterNames,
});

const updateAssignmentFilter = assignment => ({
  type: UPDATE_ASSIGNMENT_FILTER,
  data: assignment,
});

const updateAssignmentLimits = (minGrade, maxGrade) => ({
  type: UPDATE_ASSIGNMENT_LIMITS,
  data: { minGrade, maxGrade },
});

const updateCourseGradeFilter = (courseGradeMin, courseGradeMax, courseId) => ({
  type: UPDATE_COURSE_GRADE_LIMITS,
  data: {
    courseGradeMin,
    courseGradeMax,
    courseId,
  },
});

export {
  initializeFilters, resetFilters, updateAssignmentFilter,
  updateAssignmentLimits, updateCourseGradeFilter,
};
