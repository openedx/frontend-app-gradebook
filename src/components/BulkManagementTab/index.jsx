/* eslint-disable react/button-has-type, import/no-named-as-default */
import React from 'react';

import { messages } from 'data/constants/app';
import BulkManagementAlerts from './BulkManagementAlerts';
import FileUploadForm from './FileUploadForm';
import HistoryTable from './HistoryTable';

/**
 * <BulkManagementTab />
 * top-level view for managing uploads of bulk management override csvs.
 */
export const BulkManagementTab = () => (
  <div>
    <h4>{messages.BulkManagementTab.heading}</h4>
    <BulkManagementAlerts />
    <FileUploadForm />
    <HistoryTable />
  </div>
);

export default BulkManagementTab;
