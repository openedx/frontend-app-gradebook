import { useFilters } from '@src/data/filtersContext';
import { useRefetchGrades, useSelectedAssignmentLabel } from '@src/components/GradesView/data/hooks';

const useAssignmentGradeFilterData = ({ updateQueryParams }) => {
  const {
    assignmentGradeMin,
    assignmentGradeMax,
    setAssignmentGradeMin,
    setAssignmentGradeMax,
    applyAssignmentGradeLimits,
  } = useFilters();
  const selectedAssignment = useSelectedAssignmentLabel();
  const fetchGrades = useRefetchGrades();

  const handleSubmit = () => {
    const localAssignmentLimits = { assignmentGradeMin, assignmentGradeMax };
    // Commit the applied grade-limit values in the FiltersProvider (read by the
    // filter badges + export URLs).
    applyAssignmentGradeLimits(localAssignmentLimits);
    fetchGrades();
    updateQueryParams(localAssignmentLimits);
  };

  const handleSetMax = ({ target: { value } }) => {
    setAssignmentGradeMax(value);
  };

  const handleSetMin = ({ target: { value } }) => {
    setAssignmentGradeMin(value);
  };

  return {
    assignmentGradeMin,
    assignmentGradeMax,
    selectedAssignment,
    handleSetMax,
    handleSetMin,
    handleSubmit,
  };
};

export default useAssignmentGradeFilterData;
