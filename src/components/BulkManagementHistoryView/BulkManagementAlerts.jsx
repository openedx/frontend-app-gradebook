/* eslint-disable react/button-has-type */
import React from 'react';
import { FormattedMessage } from '@edx/frontend-platform/i18n';

import { Alert } from '@openedx/paragon';

import { useGradebookUi } from 'data/gradebookUiContext';
import messages from './messages';

//
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
// import selectors from 'data/selectors';
//
// export const BulkManagementAlerts = ({ bulkImportError, uploadSuccess }) => ( ... );
// BulkManagementAlerts.defaultProps = { bulkImportError: '', uploadSuccess: false };
// BulkManagementAlerts.propTypes = {
//   bulkImportError: PropTypes.string,
//   uploadSuccess: PropTypes.bool,
// };
// export const mapStateToProps = (state) => ({
//   bulkImportError: selectors.grades.bulkImportError(state),
//   uploadSuccess: selectors.grades.uploadSuccess(state),
// });
// export default connect(mapStateToProps)(BulkManagementAlerts);

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
