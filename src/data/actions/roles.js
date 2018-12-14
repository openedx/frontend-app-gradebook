import {
    GOT_ROLES,
    ERROR_FETCHING_ROLES
  } from '../constants/actionTypes/roles';
import { fetchGrades } from './grades';
import { fetchTracks } from './tracks';
import { fetchCohorts } from './cohorts';
import { fetchAssignmentTypes } from './assignmentTypes';
import LmsApiService from '../services/LmsApiService';

const allowed_roles = ['staff', 'instructor', 'support'];

const gotRoles = canUserViewGradebook => ({ type: GOT_ROLES, canUserViewGradebook });
const errorFetchingRoles = () => ({type: ERROR_FETCHING_ROLES });

const getRoles = (courseId, urlQuery) => (
  (dispatch) => {
    return LmsApiService.fetchUserRoles(courseId)
      .then(response => response.data)
      .then(roles => {
        var canUserViewGradebook = roles.some(role => (role.course_id === courseId) && allowed_roles.includes(role.role));
        dispatch(gotRoles(canUserViewGradebook));
        if(canUserViewGradebook){
          dispatch(fetchGrades(courseId, urlQuery.cohort, urlQuery.track));
          dispatch(fetchTracks(courseId));
          dispatch(fetchCohorts(courseId));
          dispatch(fetchAssignmentTypes(courseId));
        }
      })
      .catch(() => {
        dispatch(errorFetchingRoles())
      });
  });

export {
  getRoles,
  errorFetchingRoles,
};