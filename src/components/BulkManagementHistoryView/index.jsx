/* eslint-disable react/button-has-type, import/no-named-as-default */
import React from 'react';
import { FormattedMessage } from '@edx/frontend-platform/i18n';

import messages from './messages';
import BulkManagementAlerts from './BulkManagementAlerts';
import HistoryTable from './HistoryTable';

/**
 * <BulkManagementHistoryView />
 * top-level view for managing uploads of bulk management override csvs.
 */
export const BulkManagementHistoryView = () => (
  <div className="bulk-management-history-view">
    <h4 className="font-weight-bold mt-0"><FormattedMessage {...messages.heading} /></h4>
    <p className="pb-5 w-75">
      <FormattedMessage {...messages.helpText} />
    </p>
    <BulkManagementAlerts />
    <HistoryTable />
  </div>
);

export default BulkManagementHistoryView;
