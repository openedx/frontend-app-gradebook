import filterSelectors from 'data/selectors/filters';
import initialFilters from '../constants/filters';
import {
  INITIALIZE_FILTERS,
  RESET_FILTERS,
  UPDATE_ASSIGNMENT_FILTER,
  UPDATE_ASSIGNMENT_LIMITS,
  UPDATE_COURSE_GRADE_LIMITS,
  UPDATE_INCLUDE_COURSE_ROLE_MEMBERS,
} from '../constants/actionTypes/filters';
import { fetchGrades } from './grades';

const { allFilters } = filterSelectors;

const initializeFilters = ({
  assignment = initialFilters.assignment,
  assignmentType = initialFilters.assignmentType,
  track = initialFilters.track,
  cohort = initialFilters.cohort,
  assignmentGradeMin = initialFilters.assignmentGradeMin,
  assignmentGradeMax = initialFilters.assignmentGradeMax,
  courseGradeMin = initialFilters.courseGradeMin,
  courseGradeMax = initialFilters.assignmentGradeMax,
  includeCourseRoleMembers = initialFilters.includeCourseRoleMembers,
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
    includeCourseRoleMembers: Boolean(includeCourseRoleMembers),
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

const updateIncludeCourseRoleMembersFilter = (includeCourseRoleMembers) => ({
  type: UPDATE_INCLUDE_COURSE_ROLE_MEMBERS,
  data: {
    includeCourseRoleMembers,
  },
});

const updateIncludeCourseRoleMembers = includeCourseRoleMembers => (dispatch, getState) => {
  dispatch(updateIncludeCourseRoleMembersFilter(includeCourseRoleMembers));
  const state = getState();
  const { cohort, track, assignmentType } = allFilters(state);
  dispatch(fetchGrades(state.grades.courseId, cohort, track, assignmentType));
};

export {
  initializeFilters, resetFilters, updateAssignmentFilter,
  updateAssignmentLimits, updateCourseGradeFilter, updateIncludeCourseRoleMembers,
};
