/* eslint-disable react/button-has-type, import/no-named-as-default */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  Button,
  Form,
  FormControl,
  FormLabel,
  FormGroup,
} from '@edx/paragon';

import { messages } from 'data/constants/app';
import selectors from 'data/selectors';
import thunkActions from 'data/thunkActions';

const { csvUploadLabel, importBtnText } = messages.BulkManagementTab;

/**
 * <FileUploadForm />
 * File-type input wrapped with hidden control such that when a valid file is
 * added, it is automattically uploaded.
 */
export class FileUploadForm extends React.Component {
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

  get hasFile() {
    return this.fileInput && this.fileInput.files[0];
  }

  handleClickImportGrades() {
    if (this.fileInput) { this.fileInput.click(); }
  }

  handleFileInputChange() {
    return this.hasFile && (
      this.props.submitFileUploadFormData(this.formData).then(
        () => { this.fileInput.value = null; },
      )
    );
  }

  render() {
    return (
      <>
        <Form action={this.props.gradeExportUrl} method="post">
          <FormGroup controlId="csv">
            <FormLabel>{csvUploadLabel}</FormLabel>
            <FormControl
              className="d-none"
              type="file"
              onChange={this.handleFileInputChange}
              ref={this.fileInputRef}
            />
          </FormGroup>
        </Form>

        <Button variant="primary" onClick={this.handleClickImportGrades}>
          {importBtnText}
        </Button>
      </>
    );
  }
}
FileUploadForm.propTypes = {
  // redux
  gradeExportUrl: PropTypes.string.isRequired,
  submitFileUploadFormData: PropTypes.func.isRequired,
};

export const mapStateToProps = (state) => ({
  gradeExportUrl: selectors.root.gradeExportUrl(state),
});

export const mapDispatchToProps = {
  submitFileUploadFormData: thunkActions.grades.submitFileUploadFormData,
};

export default connect(mapStateToProps, mapDispatchToProps)(FileUploadForm);
