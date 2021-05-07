/* eslint-disable import/prefer-default-export */

import filters from '../actions/filters';
import selectors from '../selectors';

import { fetchGrades } from './grades';

const updateIncludeCourseRoleMembers = (includeCourseRoleMembers) => (dispatch, getState) => {
  dispatch(filters.update.includeCourseRoleMembers(includeCourseRoleMembers));
  const state = getState();
  const { cohort, track, assignmentType } = selectors.filters.allFilters(state);
  dispatch(fetchGrades(state.grades.courseId, cohort, track, assignmentType));
};

export {
  updateIncludeCourseRoleMembers,

};
