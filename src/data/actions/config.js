import { createAction } from '@reduxjs/toolkit';
import { StrictDict } from 'utils';

const gotBulkManagementConfig = createAction('config/gotBulkManagement');

export default StrictDict({
  gotBulkManagementConfig,
});
