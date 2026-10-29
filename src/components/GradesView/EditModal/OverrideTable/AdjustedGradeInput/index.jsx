import { Form } from '@openedx/paragon';
import { useIntl } from '@openedx/frontend-base';

import { useGradebookUi } from '@src/data/gradebookUiContext';
import { getLocalizedSlash } from '@src/i18n/utils';
import { useEditModalPossibleGrade } from '@src/components/GradesView/data/hooks';
import {
  adjustedGradeStatuses,
  getAdjustedGradeStatus,
} from '@src/components/GradesView/EditModal/adjustedGrade';

import messages from '../messages';

/**
 * <AdjustedGradeInput />
 * Input control for adjusting the grade of a unit
 * displays an "/ ${possibleGrade}" if there is one in the data model,
 * and an error or warning message if the entered grade fails validation.
 */
export const AdjustedGradeInput = () => {
  const { formatMessage } = useIntl();
  const possibleGrade = useEditModalPossibleGrade();
  const { modalState, setModalState } = useGradebookUi();
  const value = modalState.adjustedGradeValue;
  const hintText = possibleGrade && ` ${getLocalizedSlash()} ${possibleGrade}`;
  const status = getAdjustedGradeStatus(value, possibleGrade);
  const isInvalid = status === adjustedGradeStatuses.invalid;
  const exceedsPossible = status === adjustedGradeStatuses.exceedsPossible;

  const onChange = ({ target }) => {
    setModalState({ adjustedGradeValue: target.value });
  };

  return (
    <Form.Group className="mb-0" isInvalid={isInvalid}>
      <span>
        <Form.Control
          type="text"
          name="adjustedGradeValue"
          value={value}
          onChange={onChange}
          aria-invalid={isInvalid}
          aria-required
        />
        {hintText}
      </span>
      <div aria-live="polite">
        {isInvalid && (
          <Form.Control.Feedback type="invalid">
            {formatMessage(messages.adjustedGradeInvalid)}
          </Form.Control.Feedback>
        )}
        {exceedsPossible && (
          <Form.Control.Feedback type="warning">
            {formatMessage(messages.adjustedGradeExceedsPossible, { adjustedGrade: value, possibleGrade })}
          </Form.Control.Feedback>
        )}
      </div>
    </Form.Group>
  );
};

AdjustedGradeInput.propTypes = {};

export default AdjustedGradeInput;
