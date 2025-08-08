/* eslint-disable react/button-has-type, import/no-named-as-default */
import React from 'react';

import { useIntl } from '@openedx/frontend-base';

import { Form } from '@openedx/paragon';

import NetworkButton from '../../../components/NetworkButton';
import messages from './messages';
import useImportGradesButtonData from './hooks';

/**
 * <ImportGradesButton />
 * File-type input wrapped with hidden control such that when a valid file is
 * added, it is automattically uploaded.
 */
export const ImportGradesButton = () => {
  const {
    fileInputRef,
    gradeExportUrl,
    handleClickImportGrades,
    handleFileInputChange,
  } = useImportGradesButtonData();
  const { formatMessage } = useIntl();
  return (
    <>
      <Form action={gradeExportUrl} method="post">
        <Form.Group controlId="csv">
          <Form.Control
            data-testid="file-control"
            className="d-none"
            type="file"
            label={formatMessage(messages.csvUploadLabel)}
            onChange={handleFileInputChange}
            ref={fileInputRef}
          />
        </Form.Group>
      </Form>
      <NetworkButton
        className="import-grades-btn"
        label={messages.importGradesBtnText}
        onClick={handleClickImportGrades}
        import
      />
    </>
  );
};
ImportGradesButton.propTypes = {};

export default ImportGradesButton;
