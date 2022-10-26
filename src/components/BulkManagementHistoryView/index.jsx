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
    <h4><FormattedMessage {...messages.heading} /></h4>
    <p className="help-text">
      <FormattedMessage {...messages.helpText} />
    </p>
    <BulkManagementAlerts />
    <HistoryTable />
  </div>
);

export default BulkManagementHistoryView;
