/* eslint-disable import/prefer-default-export */
import { StrictDict } from 'utils';
import filters from '../actions/filters';
import selectors from '../selectors';

import { fetchGrades } from './grades';

export const updateIncludeCourseRoleMembers = (includeCourseRoleMembers) => (dispatch, getState) => {
  dispatch(filters.update.includeCourseRoleMembers(includeCourseRoleMembers));
  const state = getState();
  const { cohort, track, assignmentType } = selectors.filters.allFilters(state);
  const courseId = selectors.grades.courseId(state);
  dispatch(fetchGrades(courseId, cohort, track, assignmentType));
};

export default StrictDict({
  updateIncludeCourseRoleMembers,
});
