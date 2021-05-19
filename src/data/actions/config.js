import { StrictDict } from 'utils';
import { createActionFactory } from './utils';

export const dataKey = 'config';
const createAction = createActionFactory(dataKey);

const gotBulkManagementConfig = createAction('gotBulkManagement');

export default StrictDict({
  gotBulkManagementConfig,
});
