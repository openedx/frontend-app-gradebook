import selectors from 'data/selectors';
import actions from '../actions/filters';
import gradeActions from '../actions/grades';
import initialFilters from '../constants/filters';

const initialState = {};

const reducer = (state = initialState, { type: actionType, payload }) => {
  switch (actionType) {
    case actions.initialize.toString():
      return {
        ...state,
        ...payload,
      };
    case actions.reset.toString(): {
      const result = { ...state };
      payload.forEach((filterName) => {
        result[filterName] = initialFilters[filterName];
      });
      return result;
    }
    case actions.update.assignment.toString():
      return {
        ...state,
        assignment: payload,
      };
    case actions.update.assignmentLimits.toString():
      return {
        ...state,
        assignmentGradeMin: payload.minGrade,
        assignmentGradeMax: payload.maxGrade,
      };
    case actions.update.assignmentType.toString():
      return {
        ...state,
        assignmentType: payload.filterType,
        assignment: (
          (
            payload.filterType !== ''
            && (state.assignment || {}).type !== payload.filterType
          ) ? '' : state.assignment
        ),
      };
    case actions.update.courseGradeLimits.toString():
      return {
        ...state,
        courseGradeMin: payload.courseGradeMin,
        courseGradeMax: payload.courseGradeMax,
      };
    case actions.update.includeCourseRoleMembers.toString():
      return {
        ...state,
        includeCourseRoleMembers: payload,
      };
    case gradeActions.fetching.received.toString(): {
      const { assignment } = state;
      const { id, type } = assignment || {};
      if (id && !type) {
        const { relevantAssignmentDataFromResults } = selectors.filters;
        const relevantAssignment = relevantAssignmentDataFromResults(
          payload.grades,
          id,
        );
        return {
          ...state,
          track: payload.track,
          cohort: payload.cohort,
          assignment: relevantAssignment,
        };
      }
      return {
        ...state,
        track: payload.track,
        cohort: payload.cohort,
      };
    }
    default:
      return state;
  }
};

export { initialState };
export default reducer;
