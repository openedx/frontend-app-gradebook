import filterSelectors from '../selectors/filters';
import actions from '../actions/filters';
import gradeActions from '../actions/grades';
import initialFilters from '../constants/filters';

const { getAssignmentsFromResultsSubstate, chooseRelevantAssignmentData } = filterSelectors;
const initialState = {};

const reducer = (state = initialState, { type: actionType, payload }) => {
  switch (actionType) {
    case actions.update.assignmentType.toString():
      return {
        ...state,
        assignmentType: payload.filterType,
        assignment: (
          payload.filterType !== ''
          && (state.assignment || {}).type !== payload.filterType)
          ? '' : state.assignment,
      };
    case actions.initialize.toString():
      return {
        ...state,
        ...payload,
      };
    case gradeActions.received.toString(): {
      const { assignment } = state;
      const { id, type } = assignment || {};
      if (!type) {
        const relevantAssignment = getAssignmentsFromResultsSubstate(
          payload.grades,
        ).map(
          chooseRelevantAssignmentData,
        ).find(assig => assig.id === id);
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
    default:
      return state;
  }
};

export { initialState };
export default reducer;
