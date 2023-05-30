import selectors from 'data/selectors';

import { GradeFormats } from 'data/constants/grades';
import transforms from './transforms';

jest.mock('data/selectors', () => {
  const {
    GradeFormats: { absolute, percent },
  } = jest.requireActual('data/constants/grades');
  return {
    grades: {
      subsectionGrade: {
        [absolute]: jest.fn(v => ({ absolute: v })),
        [percent]: jest.fn(v => ({ percent: v })),
      },
      roundGrade: jest.fn(),
    },
  };
});

describe('redux transforms', () => {
  describe('grades transforms', () => {
    test('subsectionGrade', () => {
      const subsection = 'test-subsection';
      expect(transforms.grades.subsectionGrade({
        gradeFormat: GradeFormats.absolute,
        subsection,
      })()).toEqual(selectors.grades.subsectionGrade.absolute(subsection));
      expect(transforms.grades.subsectionGrade({
        gradeFormat: GradeFormats.percent,
        subsection,
      })()).toEqual(selectors.grades.subsectionGrade.percent(subsection));
    });
    test('roundGrade', () => {
      expect(transforms.grades.roundGrade).toEqual(selectors.grades.roundGrade);
    });
  });
});
