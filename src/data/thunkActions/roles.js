/* eslint-disable import/prefer-default-export */
import { StrictDict } from 'utils';
import roles from 'data/actions/roles';
import selectors from 'data/selectors';

import { fetchCohorts } from './cohorts';
import { fetchGrades } from './grades';
import { fetchTracks } from './tracks';
import { fetchAssignmentTypes } from './assignmentTypes';

import LmsApiService from '../services/LmsApiService';

export const allowedRoles = ['staff', 'instructor', 'support'];

export const fetchRoles = () => (
  (dispatch, getState) => {
    const courseId = selectors.app.courseId(getState());
    return LmsApiService.fetchUserRoles(courseId)
      .then(response => response.data)
      .then((response) => {
        const isAllowedRole = (role) => (
          (role.course_id === courseId) && allowedRoles.includes(role.role)
        );
        const canUserViewGradebook = (response.is_staff || (response.roles.some(isAllowedRole)));
        dispatch(roles.fetching.received({ canUserViewGradebook }));
        if (canUserViewGradebook) {
          dispatch(fetchGrades());
          dispatch(fetchTracks());
          dispatch(fetchCohorts());
          dispatch(fetchAssignmentTypes());
        }
      })
      .catch(() => {
        dispatch(roles.fetching.error());
      });
  }
);

export default StrictDict({
  allowedRoles,
  fetchRoles,
});
