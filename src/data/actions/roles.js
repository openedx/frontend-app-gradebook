import filtersSelectors from 'data/selectors/filters';
import {
  GOT_ROLES,
  ERROR_FETCHING_ROLES,
} from '../constants/actionTypes/roles';
import { fetchGrades } from './grades';
import { fetchTracks } from './tracks';
import { fetchCohorts } from './cohorts';
import { fetchAssignmentTypes } from './assignmentTypes';
import LmsApiService from '../services/LmsApiService';

const { allFilters } = filtersSelectors;

const allowedRoles = ['staff', 'instructor', 'support'];

const gotRoles = (canUserViewGradebook, courseId) => ({
  type: GOT_ROLES,
  canUserViewGradebook,
  courseId,
});
const errorFetchingRoles = () => ({ type: ERROR_FETCHING_ROLES });

const getRoles = courseId => (
  (dispatch, getState) => LmsApiService.fetchUserRoles(courseId)
    .then(response => response.data)
    .then((response) => {
      const canUserViewGradebook = response.is_staff
                                  || (response.roles.some(role => (role.course_id === courseId)
                                      && allowedRoles.includes(role.role)));
      dispatch(gotRoles(canUserViewGradebook, courseId));
      const { cohort, track, assignmentType } = allFilters(getState());
      if (canUserViewGradebook) {
        dispatch(fetchGrades(courseId, cohort, track, assignmentType));
        dispatch(fetchTracks(courseId));
        dispatch(fetchCohorts(courseId));
        dispatch(fetchAssignmentTypes(courseId));
      }
    })
    .catch(() => {
      dispatch(errorFetchingRoles());
    }));

export {
  getRoles,
  errorFetchingRoles,
};
