import { useRef } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { selectors, thunkActions } from 'data/redux/hooks';
import messages from './messages';

export const useImportButtonData = () => {
  const { formatMessage } = useIntl();
  const gradeExportUrl = selectors.root.useGradeExportUrl();
  const submitImportGradesButtonData = thunkActions.grades.useSubmitImportGradesButtonData();

  const fileInputRef = useRef();

  const handleClickImportGrades = () => fileInputRef.current?.click();
  const handleFileInputChange = () => {
    if (fileInputRef.current?.files[0]) {
      const clearInput = () => {
        fileInputRef.current.value = null;
      };
      const formData = new FormData();
      formData.append('csv', fileInputRef.current.files[0]);
      submitImportGradesButtonData(formData, formatMessage(messages.unknownImportError))
        .then(clearInput);
    }
  };

  return {
    fileInputRef,
    gradeExportUrl,
    handleClickImportGrades,
    handleFileInputChange,
  };
};

export default useImportButtonData;
