import { selectors, actions, thunkActions } from 'data/redux/hooks';

export const useEditModalData = () => {
  const error = selectors.grades.useGradeData().gradeOverrideHistoryError;
  const isOpen = selectors.app.useModalData().open;
  const closeModal = actions.app.useCloseModal();
  const doneViewingAssignment = actions.grades.useDoneViewingAssignment();
  const updateGrades = thunkActions.grades.useUpdateGrades();

  const onClose = () => {
    doneViewingAssignment();
    closeModal();
  };

  const handleAdjustedGradeClick = () => {
    updateGrades();
    doneViewingAssignment();
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
