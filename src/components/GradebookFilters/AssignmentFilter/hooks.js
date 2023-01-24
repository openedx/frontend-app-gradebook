import {
  selectors,
  actions,
  thunkActions,
} from 'data/redux/hooks';

export const useAssignmentFilterData = ({
  updateQueryParams,
}) => {
  const assignmentFilterOptions = selectors.filters.useSelectableAssignmentLabels();
  const selectedAssignment = selectors.filters.useSelectedAssignmentLabel();

  const updateAssignmentFilter = actions.filters.useUpdateAssignment();
  const conditionalFetch = thunkActions.grades.useFetchGradesIfAssignmentGradeFiltersSet();

  const handleChange = ({ target: { value: assignment } }) => {
    const selectedFilterOption = assignmentFilterOptions.find(
      ({ label }) => label === assignment,
    );
    const { type, id } = selectedFilterOption || {};
    updateAssignmentFilter({ label: assignment, type, id });
    updateQueryParams({ assignment: id });
    conditionalFetch();
  };

  return {
    handleChange,
    selectedAssignment,
    assignmentFilterOptions,
  };
};

export default useAssignmentFilterData;
