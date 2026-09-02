import { useGradebookUi } from 'data/gradebookUiContext';

import { useGradeOverrideData } from 'components/GradesView/data/hooks';
import { useUpdateGrades } from 'components/GradesView/data/apiHook';

export const useEditModalData = () => {
  const error = useGradeOverrideData().gradeOverrideHistoryError;
  const { modalState, closeModal } = useGradebookUi();
  const isOpen = modalState.open;
  const updateGrades = useUpdateGrades();

  const onClose = () => {
    closeModal();
  };

  const handleAdjustedGradeClick = () => {
    updateGrades();
    closeModal();
  };

  return {
    onClose,
    error,
    handleAdjustedGradeClick,
    isOpen,
  };
};

export default useEditModalData;
