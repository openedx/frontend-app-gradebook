import { useGradebookUi } from 'data/gradebookUiContext';
import { useFilters } from 'data/filtersContext';
import { useRefetchGrades } from 'components/GradesView/data/hooks';

export const useGradebookFiltersData = ({ updateQueryParams }) => {
  const { includeCourseRoleMembers, setIncludeCourseRoleMembers } = useFilters();
  const { closeFilterMenu } = useGradebookUi();
  const fetchGrades = useRefetchGrades();

  const handleIncludeTeamMembersChange = ({ target: { checked } }) => {
    setIncludeCourseRoleMembers(checked);
    fetchGrades();
    updateQueryParams({ includeCourseRoleMembers: checked });
  };
  return {
    closeMenu: closeFilterMenu,
    includeCourseTeamMembers: {
      handleChange: handleIncludeTeamMembersChange,
      value: includeCourseRoleMembers,
    },
  };
};

export default useGradebookFiltersData;
