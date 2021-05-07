/* eslint-disable import/prefer-default-export */

import * as filters from '../actions/filters';

import { getFilters } from '../selectors/filters';

import { fetchGrades } from './grades';

const updateIncludeCourseRoleMembers = (includeCourseRoleMembers) => (dispatch, getState) => {
  dispatch(filters.update.includeCourseRoleMembers(includeCourseRoleMembers));
  const state = getState();
  const { cohort, track, assignmentType } = getFilters(state);
  dispatch(fetchGrades(state.grades.courseId, cohort, track, assignmentType));
};

export {
  updateIncludeCourseRoleMembers,

};
