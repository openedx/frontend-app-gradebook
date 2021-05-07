import { gotBulkManagementConfig } from '../actions/config';

const reducer = (state = {}, action) => {
  switch (action.type) {
    case gotBulkManagementConfig.toString():
      return {
        ...state,
        bulkManagementAvailable: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
