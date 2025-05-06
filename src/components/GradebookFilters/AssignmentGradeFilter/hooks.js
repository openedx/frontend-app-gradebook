/* eslint-disable react/sort-comp, react/button-has-type */
import { selectors, actions, thunkActions } from 'data/redux/hooks';

const useAssignmentGradeFilterData = ({ updateQueryParams }) => {
  const localAssignmentLimits = selectors.app.useAssignmentGradeLimits();
  const selectedAssignment = selectors.filters.useSelectedAssignmentLabel();
  const fetchGrades = thunkActions.grades.useFetchGrades();
  const setFilter = actions.app.useSetLocalFilter();
  const updateAssignmentLimits = actions.filters.useUpdateAssignmentLimits();
  const isDisabled = !selectors.app.useAreAssignmentGradeFiltersValid() || !selectedAssignment;

  const handleSubmit = () => {
    updateAssignmentLimits(localAssignmentLimits);
    fetchGrades();
    updateQueryParams(localAssignmentLimits);
  };

  const handleSetMax = ({ target: { value } }) => {
    setFilter({ assignmentGradeMax: value });
  };

  const handleSetMin = ({ target: { value } }) => {
    setFilter({ assignmentGradeMin: value });
  };

  const { assignmentGradeMax, assignmentGradeMin } = localAssignmentLimits;
  return {
    assignmentGradeMin,
    assignmentGradeMax,
    selectedAssignment,
    isDisabled,
    handleSetMax,
    handleSetMin,
    handleSubmit,
  };
};

export default useAssignmentGradeFilterData;
