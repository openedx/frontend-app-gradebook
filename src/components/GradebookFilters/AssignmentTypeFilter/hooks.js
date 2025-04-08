import { selectors, actions } from '@src/data/redux/hooks';

export const useAssignmentTypeFilterData = ({ updateQueryParams }) => {
  const assignmentTypes = selectors.assignmentTypes.useAllAssignmentTypes() || {};
  const assignmentFilterOptions = selectors.filters.useSelectableAssignmentLabels();
  const selectedAssignmentType = selectors.filters.useAssignmentType() || '';
  const filterAssignmentType = actions.filters.useUpdateAssignmentType();

  const handleChange = (event) => {
    const assignmentType = event.target.value;
    filterAssignmentType(assignmentType);
    updateQueryParams({ assignmentType });
  };

  return {
    assignmentTypes,
    handleChange,
    isDisabled: assignmentFilterOptions.length === 0,
    selectedAssignmentType,
  };
};
export default useAssignmentTypeFilterData;
