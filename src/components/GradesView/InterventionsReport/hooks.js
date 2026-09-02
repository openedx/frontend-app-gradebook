import { useShowBulkManagement } from 'data/apiHook';
import { trackInterventionReportDownloaded } from 'data/services/segment/events';

import { useInterventionExportUrl } from '../data/hooks';

const useInterventionsReportData = () => {
  const interventionExportUrl = useInterventionExportUrl();
  const showBulkManagement = useShowBulkManagement();

  const handleClick = () => {
    trackInterventionReportDownloaded();
    window.location.assign(interventionExportUrl);
  };

  return {
    show: showBulkManagement,
    handleClick,
  };
};

export default useInterventionsReportData;
