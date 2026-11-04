import { adjustedGradeStatuses, getAdjustedGradeStatus } from './adjustedGrade';

const possibleGrade = '20';

describe('getAdjustedGradeStatus', () => {
  it.each(['', '   '])('returns empty for %p', (value) => {
    expect(getAdjustedGradeStatus(value, possibleGrade)).toEqual(adjustedGradeStatuses.empty);
  });
  it.each([
    '.', 'abc', '5a', '-5', '+5', '1e400', '1e3', '0x10', 'Infinity', '1.2.3', '1,5', '9'.repeat(400),
  ])('returns invalid for %p', (value) => {
    expect(getAdjustedGradeStatus(value, possibleGrade)).toEqual(adjustedGradeStatuses.invalid);
  });
  it.each(['0', '5', ' 5 ', '2.5', '.5', '5.', '20', 20])('returns valid for %p', (value) => {
    expect(getAdjustedGradeStatus(value, possibleGrade)).toEqual(adjustedGradeStatuses.valid);
  });
  it.each(['25', '20.01', '7578678786578'])('returns exceedsPossible for %p', (value) => {
    expect(getAdjustedGradeStatus(value, possibleGrade)).toEqual(adjustedGradeStatuses.exceedsPossible);
  });
  it.each(['', null, undefined])('does not flag a grade above possible if the possible grade is %p', (unknown) => {
    expect(getAdjustedGradeStatus('25', unknown)).toEqual(adjustedGradeStatuses.valid);
  });
});
