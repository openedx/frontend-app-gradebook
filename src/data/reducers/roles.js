import actions from '../actions/roles';

const initialState = {
  canUserViewGradebook: true,
};

const roles = (state = initialState, action) => {
  switch (action.type) {
    case actions.fetching.received.toString():
      return {
        ...state,
        canUserViewGradebook: action.payload,
      };
    case actions.fetching.error.toString():
      return {
        ...state,
        canUserViewGradebook: false,
      };
    default:
      return state;
  }
};

export { initialState };
export default roles;
