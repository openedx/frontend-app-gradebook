import { useRef } from 'react';
import { selectors, thunkActions } from 'data/redux/hooks';

export const useImportButtonData = () => {
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
