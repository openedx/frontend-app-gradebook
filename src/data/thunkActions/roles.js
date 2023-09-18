/* eslint-disable import/prefer-default-export */
import { StrictDict } from 'utils';
import roles from 'data/actions/roles';
import selectors from 'data/selectors';

import lms from 'data/services/lms';

import { fetchCohorts } from './cohorts';
import { fetchGrades } from './grades';
import { fetchTracks } from './tracks';
import { fetchAssignmentTypes } from './assignmentTypes';

export const allowedRoles = ['staff', 'limited_staff', 'instructor', 'support'];

export const fetchRoles = () => (
  (dispatch, getState) => {
    const courseId = selectors.app.courseId(getState());
    return lms.api.fetch.roles()
      .then(({ data }) => {
        const isAllowedRole = (role) => (
          (role.course_id === courseId) && allowedRoles.includes(role.role)
        );
        const canUserViewGradebook = (data.is_staff || (data.roles.some(isAllowedRole)));
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
