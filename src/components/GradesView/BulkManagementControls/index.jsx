import NetworkButton from '@src/components/NetworkButton';
import { useShowBulkManagement } from '@src/data/apiHook';
import { trackGradesReportDownloaded } from '@src/data/services/segment/events';

import ImportGradesButton from '../ImportGradesButton';
import { useGradeExportUrl } from '../data/hooks';
import messages from './messages';

/**
 * <BulkManagementControls />
 * Provides download buttons for Bulk Management and Intervention reports, only if
 * showBulkManagement is set in redus.
 */
export const BulkManagementControls = () => {
  const gradeExportUrl = useGradeExportUrl();
  const showBulkManagement = useShowBulkManagement();

  const handleClickExportGrades = () => {
    trackGradesReportDownloaded();
    window.location.assign(gradeExportUrl);
  };

  if (!showBulkManagement) { return null; }
  return (
    <div className="d-flex">
      <NetworkButton
        label={messages.downloadGradesBtn}
        onClick={handleClickExportGrades}
      />
      <ImportGradesButton />
    </div>
  );
};

export default BulkManagementControls;
