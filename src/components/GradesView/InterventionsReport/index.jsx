import React from 'react';

import { useIntl } from '@edx/frontend-platform/i18n';

import NetworkButton from 'components/NetworkButton';

import messages from './messages';
import useInterventionsReportData from './hooks';

/**
 * <InterventionsReport />
 * Provides download buttons for Bulk Management and Intervention reports, only if
 * showBulkManagement is set in redus.
 */
export const InterventionsReport = () => {
  const { show, handleClick } = useInterventionsReportData();
  const { formatMessage } = useIntl();

  if (!show) {
    return null;
  }

  return (
    <div>
      <h4 className="mt-0">
        {formatMessage(messages.title)}
      </h4>
      <div
        className="d-flex justify-content-between align-items-center"
      >
        <div className="intervention-report-description">
          {formatMessage(messages.description)}
        </div>
        <NetworkButton
          label={messages.downloadBtn}
          onClick={handleClick}
        />
      </div>
    </div>
  );
};

export default InterventionsReport;
