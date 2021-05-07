import actions from '../actions/config';

const reducer = (state = {}, action) => {
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

export default reducer;
