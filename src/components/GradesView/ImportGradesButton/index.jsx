import { useRef } from 'react';

import { useIntl } from '@openedx/frontend-base';

import { Form } from '@openedx/paragon';

import NetworkButton from '@src/components/NetworkButton';

import { useGradeExportUrl } from '../data/hooks';
import { useSubmitImportGradesButtonData } from '../data/apiHook';
import messages from './messages';

/**
 * <ImportGradesButton />
 * File-type input wrapped with hidden control such that when a valid file is
 * added, it is automattically uploaded.
 */
export const ImportGradesButton = () => {
  const { formatMessage } = useIntl();
  const gradeExportUrl = useGradeExportUrl();
  const submitImportGradesButtonData = useSubmitImportGradesButtonData();
  const fileInputRef = useRef(null);

  const handleClickImportGrades = () => fileInputRef.current?.click();
  const handleFileInputChange = () => {
    const file = fileInputRef.current?.files?.[0];
    if (file) {
      const clearInput = () => {
        if (fileInputRef.current) {
          fileInputRef.current.value = null;
        }
      };
      const formData = new FormData();
      formData.append('csv', file);
      submitImportGradesButtonData(formData).then(clearInput);
    }
  };

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
