import { FormattedMessage } from '@openedx/frontend-base';

import { Alert } from '@openedx/paragon';

import { useGradebookUi } from '@src/data/gradebookUiContext';
import messages from './messages';

/**
 * <BulkManagementAlerts />
 * Alerts to display at the top of the BulkManagement tab.
 */
export const BulkManagementAlerts = () => {
  const { csvUploadSuccess, csvUploadErrorMessages } = useGradebookUi();
  // Mirrors the old `selectors.grades.bulkImportError` string formatting.
  const bulkImportError = csvUploadErrorMessages.length
    ? `Errors while processing: ${csvUploadErrorMessages.join('; ')};`
    : '';

  return (
    <>
      <Alert
        variant="danger"
        show={!!bulkImportError}
        dismissible={false}
      >
        {bulkImportError}
      </Alert>
      <Alert
        variant="success"
        show={csvUploadSuccess}
        dismissible={false}
      >
        <FormattedMessage {...messages.successDialog} />
      </Alert>
    </>
  );
};

BulkManagementAlerts.propTypes = {};

export default BulkManagementAlerts;
