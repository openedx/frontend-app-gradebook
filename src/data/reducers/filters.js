import filterSelectors from 'data/selectors/filters';
import { GOT_GRADES, FILTER_BY_ASSIGNMENT_TYPE } from '../constants/actionTypes/grades';
import {
  INITIALIZE_FILTERS,
  UPDATE_ASSIGNMENT_FILTER,
  UPDATE_ASSIGNMENT_LIMITS,
  UPDATE_COURSE_GRADE_LIMITS,
  RESET_FILTERS,
  UPDATE_INCLUDE_COURSE_ROLE_MEMBERS,
} from '../constants/actionTypes/filters';
import initialFilters from '../constants/filters';

const { getAssignmentsFromResultsSubstate, chooseRelevantAssignmentData } = filterSelectors;
const initialState = {};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FILTER_BY_ASSIGNMENT_TYPE:
      return {
        ...state,
        assignmentType: action.filterType,
        assignment: (
          action.filterType !== ''
          && (state.assignment || {}).type !== action.filterType)
          ? '' : state.assignment,
      };
    case INITIALIZE_FILTERS:
      return {
        ...state,
        ...action.data,
      };
    case GOT_GRADES: {
      const { assignment } = state;
      const { id, type } = assignment || {};
      if (!type) {
        const relevantAssignment = getAssignmentsFromResultsSubstate(action.grades)
          .map(chooseRelevantAssignmentData)
          .find(assig => assig.id === id);
        return {
          ...state,
          track: action.track,
          cohort: action.cohort,
          assignment: relevantAssignment,
        };
      }
      return {
        ...state,
        track: action.track,
        cohort: action.cohort,
      };
    }
    case RESET_FILTERS: {
      const result = { ...state };
      action.filterNames.forEach((filterName) => {
        result[filterName] = initialFilters[filterName];
      });
      return result;
    }
    case UPDATE_ASSIGNMENT_FILTER:
      return {
        ...state,
        assignment: action.data,
      };
    case UPDATE_ASSIGNMENT_LIMITS:
      return {
        ...state,
        assignmentGradeMin: action.data.minGrade,
        assignmentGradeMax: action.data.maxGrade,
      };
    case UPDATE_COURSE_GRADE_LIMITS:
      return {
        ...state,
        courseGradeMin: action.data.courseGradeMin,
        courseGradeMax: action.data.courseGradeMax,
      };
    case UPDATE_INCLUDE_COURSE_ROLE_MEMBERS:
      return {
        ...state,
        includeCourseRoleMembers: action.data.includeCourseRoleMembers,
      };
    default:
      return state;
  }
};

export default reducer;
