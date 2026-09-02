import { useFilters } from 'data/filtersContext';
import {
  useFetchGradesIfAssignmentGradeFiltersSet,
  useSelectableAssignmentLabels,
  useSelectedAssignmentLabel,
} from 'components/GradesView/data/hooks';

export const useAssignmentFilterData = ({
  updateQueryParams,
}) => {
  const assignmentFilterOptions = useSelectableAssignmentLabels();
  const selectedAssignmentLabel = useSelectedAssignmentLabel() || '';

  const { setAssignment } = useFilters();
  const conditionalFetch = useFetchGradesIfAssignmentGradeFiltersSet();

  const handleChange = ({ target: { value: assignment } }) => {
    const selectedFilterOption = assignmentFilterOptions.find(
      ({ label }) => label === assignment,
    );
    const { id } = selectedFilterOption || {};
    setAssignment(id ?? '');
    updateQueryParams({ assignment: id });
    conditionalFetch();
  };

  return {
    handleChange,
    selectedAssignmentLabel,
    assignmentFilterOptions,
  };
};

export default useAssignmentFilterData;
