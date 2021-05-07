import * as actions from '../actions/roles';

const initialState = {
  canUserViewGradebook: null,
};

const roles = (state = initialState, action) => {
  switch (action.type) {
    case actions.received.toString():
      return {
        ...state,
        canUserViewGradebook: action.payload,
      };
    case actions.errorFetching.toString():
      return {
        ...state,
        canUserViewGradebook: false,
      };
    default:
      return state;
  }
};

export default roles;
