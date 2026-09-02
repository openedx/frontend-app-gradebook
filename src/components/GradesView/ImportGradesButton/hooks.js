import { useRef } from 'react';

import { useGradeExportUrl } from '../data/hooks';
import { useSubmitImportGradesButtonData } from '../data/apiHook';

export const useImportButtonData = () => {
  const gradeExportUrl = useGradeExportUrl();
  const submitImportGradesButtonData = useSubmitImportGradesButtonData();

  const fileInputRef = useRef();

  const handleClickImportGrades = () => fileInputRef.current?.click();
  const handleFileInputChange = () => {
    if (fileInputRef.current?.files[0]) {
      const clearInput = () => {
        fileInputRef.current.value = null;
      };
      const formData = new FormData();
      formData.append('csv', fileInputRef.current.files[0]);
      submitImportGradesButtonData(formData).then(clearInput);
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
