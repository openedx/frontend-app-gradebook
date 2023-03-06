import React from 'react';
import { StrictDict } from 'utils';
import { actions, selectors, thunkActions } from 'data/redux/hooks';
import * as module from './hooks';

export const state = StrictDict({
  includeCourseRoleMembers: (val) => React.useState(val), // eslint-disable-line
});

export const useGradebookFiltersData = ({ updateQueryParams }) => {
  const includeCourseRoleMembers = selectors.filters.useIncludeCourseRoleMembers();
  const updateIncludeCourseRoleMembers = actions.filters.useUpdateIncludeCourseRoleMembers();
  const closeMenu = thunkActions.app.useCloseFilterMenu();
  const fetchGrades = thunkActions.grades.useFetchGrades();

  const [
    localIncludeCourseRoleMembers,
    setLocalIncludeCourseRoleMembers,
  ] = module.state.includeCourseRoleMembers(includeCourseRoleMembers);

  const handleIncludeTeamMembersChange = ({ target: { checked } }) => {
    setLocalIncludeCourseRoleMembers(checked);
    updateIncludeCourseRoleMembers(checked);
    fetchGrades();
    updateQueryParams({ includeCourseRoleMembers: checked });
  };
  return {
    closeMenu,
    includeCourseTeamMembers: {
      handleChange: handleIncludeTeamMembersChange,
      value: localIncludeCourseRoleMembers,
    },
  };
};

export default useGradebookFiltersData;
