/* eslint-disable react/sort-comp, react/button-has-type */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  Button,
  StatusAlert,
  Table,
  Tab,
} from '@edx/paragon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { configuration } from '../../config';

import { submitFileUploadFormData } from '../../data/actions/grades';
import { getBulkManagementHistory } from '../../data/selectors/grades';

export class BulkManagement extends React.Component {
  constructor(props) {
    super(props);
    this.fileFormRef = React.createRef();
    this.fileInputRef = React.createRef();
  }

  formatHistoryRow = (row) => {
    const {
      summaryOfRowsProcessed: {
        total,
        successfullyProcessed,
        failed,
        skipped,
      },
      unique_id: courseId,
      originalFilename,
      id,
      user: username,
      ...rest
    } = row;
    const resultsText = [
      `${total} Students: ${successfullyProcessed} processed`,
      ...(skipped > 0 ? [`${skipped} skipped`] : []),
      ...(failed > 0 ? [`${failed} failed`] : []),
    ].join(', ');
    const resultsSummary = (
      <a
        href={`${configuration.LMS_BASE_URL}/api/bulk_grades/course/${courseId}/?error_id=${id}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <FontAwesomeIcon icon={faDownload} />
        {resultsText}
      </a>
    );
    const createWrappedCell = (text) => (<span className="wrap-text-in-cell">{text}</span>);
    const filename = createWrappedCell(originalFilename);
    const user = createWrappedCell(username);
    return {
      resultsSummary,
      filename,
      user,
      ...rest,
    };
  };

  handleClickImportGrades = () => {
    const fileInput = this.fileInputRef.current;
    if (fileInput) {
      fileInput.click();
    }
  };

  handleFileInputChange = (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];
    const form = this.fileFormRef.current;
    if (file && form) {
      const formData = new FormData(form);
      this.props.submitFileUploadFormData(this.props.courseId, formData).then(() => {
        fileInput.value = null;
      });
    }
  };

  render() {
    return (
      <Tab eventKey="bulk_management" title="Bulk Management">
        <h4>Use this feature by downloading a CSV for bulk management,
          overriding grades locally, and coming back here to upload.
        </h4>
        <form ref={this.fileFormRef} action={this.props.gradeExportUrl} method="post">
          <StatusAlert
            alertType="danger"
            dialog={this.props.bulkImportError}
            open={this.props.bulkImportError}
            dismissible={false}
          />
          <StatusAlert
            alertType="success"
            dialog="CSV processing. File uploads may take several minutes to complete"
            open={this.props.uploadSuccess}
            dismissible={false}
          />
          <input
            className="d-none"
            type="file"
            name="csv"
            label="Upload Grade CSV"
            onChange={this.handleFileInputChange}
            ref={this.fileInputRef}
          />
        </form>
        <Button
          variant="primary"
          onClick={this.handleClickImportGrades}
        >
          Import Grades
        </Button>
        <p>
          Results appear in the table below.<br />
          Grade processing may take a few seconds.
        </p>
        <Table
          data={this.props.bulkManagementHistory.map(this.formatHistoryRow)}
          hasFixedColumnWidths
          columns={[
            {
              key: 'filename',
              label: 'Gradebook',
              columnSortable: false,
              width: 'col-5',
            },
            {
              key: 'resultsSummary',
              label: 'Download Summary',
              columnSortable: false,
              width: 'col',
            },
            {
              key: 'user',
              label: 'Who',
              columnSortable: false,
              width: 'col-1',
            },
            {
              key: 'timeUploaded',
              label: 'When',
              columnSortable: false,
              width: 'col',
            },
          ]}
          className="table-striped"
        />
      </Tab>
    );
  }
}

BulkManagement.defaultProps = {
  bulkImportError: '',
  bulkManagementHistory: [],
  courseId: '',
  uploadSuccess: false,
};

BulkManagement.propTypes = {
  courseId: PropTypes.string,
  gradeExportUrl: PropTypes.string.isRequired,

  // redux
  bulkImportError: PropTypes.string,
  bulkManagementHistory: PropTypes.arrayOf(PropTypes.shape({
    originalFilename: PropTypes.string.isRequired,
    user: PropTypes.string.isRequired,
    timeUploaded: PropTypes.string.isRequired,
    summaryOfRowsProcessed: PropTypes.shape({
      total: PropTypes.number.isRequired,
      successfullyProcessed: PropTypes.number.isRequired,
      failed: PropTypes.number.isRequired,
      skipped: PropTypes.number.isRequired,
    }).isRequired,
  })),
  submitFileUploadFormData: PropTypes.func.isRequired,
  uploadSuccess: PropTypes.bool,
};

export const mapStateToProps = (state) => ({
  bulkImportError: state.grades.bulkManagement
    && state.grades.bulkManagement.errorMessages
    ? `Errors while processing: ${state.grades.bulkManagement.errorMessages.join(', ')}`
    : '',
  bulkManagementHistory: getBulkManagementHistory(state),
  uploadSuccess: !!(state.grades.bulkManagement && state.grades.bulkManagement.uploadSuccess),
});

export const mapDispatchToProps = {
  submitFileUploadFormData,
};

export default connect(mapStateToProps, mapDispatchToProps)(BulkManagement);
