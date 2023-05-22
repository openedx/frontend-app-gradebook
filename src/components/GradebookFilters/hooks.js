import { actions, selectors, thunkActions } from 'data/redux/hooks';

export const useGradebookFiltersData = ({ updateQueryParams }) => {
  const includeCourseRoleMembers = selectors.filters.useIncludeCourseRoleMembers();
  const updateIncludeCourseRoleMembers = actions.filters.useUpdateIncludeCourseRoleMembers();
  const closeMenu = thunkActions.app.filterMenu.useCloseMenu();
  const fetchGrades = thunkActions.grades.useFetchGrades();

  const handleIncludeTeamMembersChange = ({ target: { checked } }) => {
    updateIncludeCourseRoleMembers(checked);
    fetchGrades();
    updateQueryParams({ includeCourseRoleMembers: checked });
  };
  return {
    closeMenu,
    includeCourseTeamMembers: {
      handleChange: handleIncludeTeamMembersChange,
      value: includeCourseRoleMembers,
    },
  };
};

export default useGradebookFiltersData;
