import { Form } from '@openedx/paragon';

import { useGradebookUi } from '@src/data/gradebookUiContext';
import { getLocalizedSlash } from '@src/i18n/utils';
import { useEditModalPossibleGrade } from '@src/components/GradesView/data/hooks';

/**
 * <AdjustedGradeInput />
 * Input control for adjusting the grade of a unit
 * displays an "/ ${possibleGrade} if there is one in the data model.
 */
export const AdjustedGradeInput = () => {
  const possibleGrade = useEditModalPossibleGrade();
  const { modalState, setModalState } = useGradebookUi();
  const value = modalState.adjustedGradeValue;
  const hintText = possibleGrade && ` ${getLocalizedSlash()} ${possibleGrade}`;

  const onChange = ({ target }) => {
    setModalState({ adjustedGradeValue: target.value });
  };

  return (
    <span>
      <Form.Control
        type="text"
        name="adjustedGradeValue"
        value={value}
        onChange={onChange}
      />
      {hintText}
    </span>
  );
};

AdjustedGradeInput.propTypes = {};

export default AdjustedGradeInput;
