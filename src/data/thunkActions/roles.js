/* eslint-disable import/prefer-default-export */
import { StrictDict } from 'utils';
import roles from '../actions/roles';
import selectors from '../selectors';

import { fetchCohorts } from './cohorts';
import {
  fetchGrades,
} from './grades';
import { fetchTracks } from './tracks';
import { fetchAssignmentTypes } from './assignmentTypes';

import LmsApiService from '../services/LmsApiService';

export const allowedRoles = ['staff', 'instructor', 'support'];

export const fetchRoles = courseId => (
  (dispatch, getState) => LmsApiService.fetchUserRoles(courseId)
    .then(response => response.data)
    .then((response) => {
      const isAllowedRole = (role) => (
        (role.course_id === courseId) && allowedRoles.includes(role.role)
      );
      const canUserViewGradebook = (response.is_staff || (response.roles.some(isAllowedRole)));

      dispatch(roles.received({ canUserViewGradebook, courseId }));

      const { cohort, track, assignmentType } = selectors.filters.allFilters(getState());
      if (canUserViewGradebook) {
        dispatch(fetchGrades(courseId, cohort, track, assignmentType));
        dispatch(fetchTracks(courseId));
        dispatch(fetchCohorts(courseId));
        dispatch(fetchAssignmentTypes(courseId));
      }
    })
    .catch(() => {
      dispatch(roles.errorFetching());
    }));

export default StrictDict({
  allowedRoles,
  fetchRoles,
});
