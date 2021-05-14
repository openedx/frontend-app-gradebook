import actions from '../actions/config';

const initialState = {};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.gotBulkManagementConfig.toString():
      return {
        ...state,
        bulkManagementAvailable: action.payload,
      };
    default:
      return state;
  }
};

export { initialState };
export default reducer;
