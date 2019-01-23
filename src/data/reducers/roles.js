import {
  GOT_ROLES,
  ERROR_FETCHING_ROLES,
} from '../constants/actionTypes/roles';

const initialState = {
  canUserViewGradebook: null,
};

const roles = (state = initialState, action) => {
  switch (action.type) {
    case GOT_ROLES:
      return {
        ...state,
        canUserViewGradebook: action.canUserViewGradebook,
      };
    case ERROR_FETCHING_ROLES:
      return {
        ...state,
        canUserViewGradebook: false,
      };
    default:
      return state;
  }
};

export default roles;
