import { StrictDict } from '@src/utils';
import { createActionFactory } from './utils';

export const dataKey = 'config';
const createAction = createActionFactory(dataKey);

/**
 * gotBulkManagemmentConfig(bulkManagementAvailable)
 * @param {bool} bulkManagementAvailable - is bulk management available?
 */
const gotBulkManagementConfig = createAction('gotBulkManagement');

export default StrictDict({
  gotBulkManagementConfig,
});
