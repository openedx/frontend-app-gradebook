/* eslint-disable react/button-has-type, import/no-named-as-default */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  Button,
  Form,
  Table,
} from '@edx/paragon';

import * as appConstants from 'data/constants/app';
import selectors from 'data/selectors';
import thunkActions from 'data/thunkActions';
import BulkManagementAlerts from './BulkManagementAlerts';
import ResultsSummary from './ResultsSummary';

const { bulkManagementColumns, messages: { BulkManagementTab: messages } } = appConstants;

export class BulkManagementTab extends React.Component {
  constructor(props) {
    super(props);
    this.fileInputRef = React.createRef();
    this.handleClickImportGrades = this.handleClickImportGrades.bind(this);
    this.handleFileInputChange = this.handleFileInputChange.bind(this);
  }

  get fileInput() {
    return this.fileInputRef.current;
  }

  get formData() {
    const data = new FormData();
    data.append('csv', this.fileInput.files[0]);
    return data;
  }

  handleClickImportGrades() {
    if (this.fileInput) { this.fileInput.click(); }
  }

  handleFileInputChange() {
    const hasFile = this.fileInput && this.fileInput.files[0];
    return hasFile && this.props.submitFileUploadFormData(this.formData).then(() => {
      this.fileInput.value = null;
    });
  }

  formatHistoryRow({
    resultsSummary,
    originalFilename,
    user,
    ...rest
  }) {
    return ({
      resultsSummary: (<ResultsSummary {...resultsSummary} />),
      filename: (<span className="wrap-text-in-cell">{originalFilename}</span>),
      user: (<span className="wrap-text-in-cell">{user}</span>),
      ...rest,
    });
  }

  render() {
    return (
      <div>
        <h4>{messages.heading}</h4>

        <form action={this.props.gradeExportUrl} method="post">
          <BulkManagementAlerts />

          <Form.Group controlId="csv">
            <Form.Label>{messages.csvUploadLabel}</Form.Label>
            <Form.Control
              className="d-none"
              type="file"
              onChange={this.handleFileInputChange}
              ref={this.fileInputRef}
            />
          </Form.Group>
        </form>

        <Button variant="primary" onClick={this.handleClickImportGrades}>
          {messages.importBtn}
        </Button>

        <p>
          {messages.hints[0]}
          <br />
          {messages.hints[1]}
        </p>

        <Table
          data={this.props.bulkManagementHistory.map(this.formatHistoryRow)}
          hasFixedColumnWidths
          columns={bulkManagementColumns}
          className="table-striped"
        />
      </div>
    );
  }
}

BulkManagementTab.defaultProps = {
  bulkManagementHistory: [],
};

BulkManagementTab.propTypes = {
  // redux
  bulkManagementHistory: PropTypes.arrayOf(PropTypes.shape({
    originalFilename: PropTypes.string.isRequired,
    user: PropTypes.string.isRequired,
    timeUploaded: PropTypes.string.isRequired,
    resultsSummary: PropTypes.shape({
      rowId: PropTypes.number.isRequired,
      courseId: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    }),
  })),
  gradeExportUrl: PropTypes.string.isRequired,
  submitFileUploadFormData: PropTypes.func.isRequired,
};

export const mapStateToProps = (state) => ({
  bulkManagementHistory: selectors.grades.bulkManagementHistoryEntries(state),
  gradeExportUrl: selectors.root.gradeExportUrl(state),
});

export const mapDispatchToProps = {
  submitFileUploadFormData: thunkActions.grades.submitFileUploadFormData,
};

export default connect(mapStateToProps, mapDispatchToProps)(BulkManagementTab);
