import { useGradebookUi } from 'data/gradebookUiContext';
import { useEditModalPossibleGrade } from 'components/GradesView/data/hooks';
import { getLocalizedSlash } from 'i18n/utils';

const useAdjustedGradeInputData = () => {
  const possibleGrade = useEditModalPossibleGrade();
  const { modalState, setModalState } = useGradebookUi();
  const value = modalState.adjustedGradeValue;
  const hintText = possibleGrade && ` ${getLocalizedSlash()} ${possibleGrade}`;

  const onChange = ({ target }) => {
    setModalState({ adjustedGradeValue: target.value });
  };

  return {
    value,
    onChange,
    hintText,
  };
};

export default useAdjustedGradeInputData;
