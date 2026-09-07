import React from 'react';

import { useIntl } from '@openedx/frontend-base';

import NetworkButton from 'components/NetworkButton';
import { useShowBulkManagement } from 'data/apiHook';
import { trackInterventionReportDownloaded } from 'data/services/segment/events';

import { useInterventionExportUrl } from '../data/hooks';
import messages from './messages';

/**
 * <InterventionsReport />
 * Provides download buttons for Bulk Management and Intervention reports, only if
 * showBulkManagement is set in redus.
 */
export const InterventionsReport = () => {
  const interventionExportUrl = useInterventionExportUrl();
  const showBulkManagement = useShowBulkManagement();
  const { formatMessage } = useIntl();

  const handleClick = () => {
    trackInterventionReportDownloaded();
    window.location.assign(interventionExportUrl);
  };

  if (!showBulkManagement) {
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
