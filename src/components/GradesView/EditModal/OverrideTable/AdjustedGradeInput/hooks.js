import { actions, selectors } from 'data/redux/hooks';
import { getLocalizedSlash } from 'i18n/utils';

const useAdjustedGradeInputData = () => {
  const possibleGrade = selectors.root.useEditModalPossibleGrade();
  const value = selectors.app.useModalData().adjustedGradeValue;
  const setModalState = actions.app.useSetModalState();
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
