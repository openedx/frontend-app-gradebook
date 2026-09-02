import { useShowBulkManagement } from 'data/apiHook';
import { trackGradesReportDownloaded } from 'data/services/segment/events';

import { useGradeExportUrl } from '../data/hooks';

export const useBulkManagementControlsData = () => {
  const gradeExportUrl = useGradeExportUrl();
  const showBulkManagement = useShowBulkManagement();

  const handleClickExportGrades = () => {
    trackGradesReportDownloaded();
    window.location.assign(gradeExportUrl);
  };

  return {
    show: showBulkManagement,
    handleClickExportGrades,
  };
};
export default useBulkManagementControlsData;
