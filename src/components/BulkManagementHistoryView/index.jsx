/* eslint-disable react/button-has-type, import/no-named-as-default */
import React from 'react';
import { FormattedMessage } from '@edx/frontend-platform/i18n';

import messages from './messages';
import BulkManagementAlerts from './BulkManagementAlerts';
import FileUploadForm from './FileUploadForm';
import HistoryTable from './HistoryTable';

/**
 * <BulkManagementTab />
 * top-level view for managing uploads of bulk management override csvs.
 */
export const BulkManagementTab = () => (
  <div>
    <h4><FormattedMessage {...(messages.heading)} /></h4>
    <BulkManagementAlerts />
    <FileUploadForm />
    <HistoryTable />
  </div>
);

export default BulkManagementTab;
