/* eslint-disable import/prefer-default-export */
import { createAction } from '@reduxjs/toolkit';

const gotBulkManagementConfig = createAction('config/gotBulkManagement'); // payload

export {
  gotBulkManagementConfig,
};
