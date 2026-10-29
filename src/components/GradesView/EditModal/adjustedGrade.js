import { StrictDict } from '@src/utils';

export const adjustedGradeStatuses = StrictDict({
  empty: 'empty',
  invalid: 'invalid',
  exceedsPossible: 'exceedsPossible',
  valid: 'valid',
});

const nonNegativeDecimal = /^(?:\d+(?:\.\d*)?|\.\d+)$/;

/**
 * getAdjustedGradeStatus(value, possibleGrade)
 * Returns the validation status of the adjusted grade entered in the edit modal.
 * Only plain non-negative decimals are valid (the api parses the value with python float()).
 * A grade above the possible grade is allowed, but flagged as exceedsPossible.
 * @param {string|number} value - entered adjusted grade
 * @param {string|number} possibleGrade - possible grade shown in the edit modal, if any
 * @return {string} - one of adjustedGradeStatuses
 */
export const getAdjustedGradeStatus = (value, possibleGrade) => {
  const grade = `${value}`.trim();
  if (grade === '') {
    return adjustedGradeStatuses.empty;
  }
  const number = Number(grade);
  if (!nonNegativeDecimal.test(grade) || !Number.isFinite(number)) {
    return adjustedGradeStatuses.invalid;
  }
  if (possibleGrade && number > Number(possibleGrade)) {
    return adjustedGradeStatuses.exceedsPossible;
  }
  return adjustedGradeStatuses.valid;
};
