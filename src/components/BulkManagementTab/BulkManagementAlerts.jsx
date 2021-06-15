/* eslint-disable react/sort-comp, react/button-has-type */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Alert } from '@edx/paragon';

import * as appConstants from 'data/constants/app';
import selectors from 'data/selectors';

const { messages: { BulkManagementTab: messages } } = appConstants;

export const BulkManagementAlerts = ({ bulkImportError, uploadSuccess }) => (
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
      show={uploadSuccess}
      dismissible={false}
    >
      {messages.successDialog}
    </Alert>
  </>
);

BulkManagementAlerts.defaultProps = {
  bulkImportError: '',
  uploadSuccess: false,
};

BulkManagementAlerts.propTypes = {
  // redux
  bulkImportError: PropTypes.string,
  uploadSuccess: PropTypes.bool,
};

export const mapStateToProps = (state) => ({
  bulkImportError: selectors.grades.bulkImportError(state),
  uploadSuccess: selectors.grades.uploadSuccess(state),
});

export default connect(mapStateToProps)(BulkManagementAlerts);
