import { actions, selectors } from 'data/redux/hooks';
import { getLocalizedSlash } from 'i18n/utils';

const useAdjustedGradeInputData = () => {
  const possibleGrade = selectors.root.useEditModalPossibleGrade();
  const value = selectors.app.useModalData().adjustedGradeValue;
  const setModalState = actions.app.useSetModalState();
  const hintText = possibleGrade && ` ${getLocalizedSlash()} ${possibleGrade}`;

  const onChange = ({ target }) => {
    let adjustedGradeValue;
    switch (true) {
      case target.value < 0:
        adjustedGradeValue = 0;
        break;
      case possibleGrade && target.value > possibleGrade:
        adjustedGradeValue = possibleGrade;
        break;
      default:
        adjustedGradeValue = target.value;
    }
    setModalState({ adjustedGradeValue });
  };

  return {
    value,
    onChange,
    hintText,
    possibleGrade,
  };
};

export default useAdjustedGradeInputData;
