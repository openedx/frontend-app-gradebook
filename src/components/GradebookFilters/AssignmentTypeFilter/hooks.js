import { useFilters } from 'data/filtersContext';
import { useAssignmentTypes, useCourseIdWithGate } from 'data/apiHook';
import { useSelectableAssignmentLabels } from 'components/GradesView/data/hooks';

export const useAssignmentTypeFilterData = ({ updateQueryParams }) => {
  const { courseId, enabled } = useCourseIdWithGate();
  const assignmentTypes = useAssignmentTypes(courseId, { enabled }).data?.assignmentTypes ?? [];
  const assignmentFilterOptions = useSelectableAssignmentLabels();
  const { assignmentType: selectedAssignmentType, setAssignmentType } = useFilters();

  const handleChange = (event) => {
    const assignmentType = event.target.value;
    setAssignmentType(assignmentType);
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
