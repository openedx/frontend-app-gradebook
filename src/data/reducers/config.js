import GOT_BULK_MANAGEMENT_CONFIG from '../constants/actionTypes/config';

const reducer = (state = {}, action) => {
  switch (action.type) {
    case GOT_BULK_MANAGEMENT_CONFIG:
      return {
        ...state,
        bulkManagementAvailable: action.data,
      };
    default:
      return state;
  }
};

export default reducer;
