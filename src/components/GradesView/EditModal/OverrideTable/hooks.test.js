import { useIntl } from '@edx/frontend-platform/i18n';

import { gradeOverrideHistoryColumns as columns } from 'data/constants/app';
import { selectors } from 'data/redux/hooks';

import useOverrideTableData from './hooks';
import messages from './messages';

jest.mock('data/redux/hooks', () => ({
  selectors: {
    grades: {
      useHasOverrideErrors: jest.fn(),
      useGradeData: jest.fn(),
    },
  },
}));

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(context => context),
}));

jest.mock('@edx/frontend-platform/i18n', () => ({
  ...jest.requireActual('@edx/frontend-platform/i18n'),
  useIntl: jest.fn(() => ({
    formatMessage: (message) => message.defaultMessage,
  })),
}));

selectors.grades.useHasOverrideErrors.mockReturnValue(false);
const gradeOverrides = ['some', 'override', 'data'];
const gradeData = { gradeOverrideHistoryResults: gradeOverrides };
selectors.grades.useGradeData.mockReturnValue(gradeData);

let out;
describe('useOverrideTableData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    out = useOverrideTableData();
  });
  describe('behavior', () => {
    it('initializes intl hook', () => {
      expect(useIntl).toHaveBeenCalled();
    });
    it('initializes redux hooks', () => {
      expect(selectors.grades.useHasOverrideErrors).toHaveBeenCalled();
      expect(selectors.grades.useGradeData).toHaveBeenCalled();
    });
  });
  describe('output', () => {
    describe('no errors', () => {
      test('hide is false', () => {
        expect(out.hide).toEqual(false);
      });
      describe('columns', () => {
        test('date column', () => {
          const { Header, accessor } = out.columns[0];
          expect(Header).toEqual(messages.dateHeader.defaultMessage);
          expect(accessor).toEqual(columns.date);
        });
        test('grader column', () => {
          const { Header, accessor } = out.columns[1];
          expect(Header).toEqual(messages.graderHeader.defaultMessage);
          expect(accessor).toEqual(columns.grader);
        });
        test('reason column', () => {
          const { Header, accessor } = out.columns[2];
          expect(Header).toEqual(messages.reasonHeader.defaultMessage);
          expect(accessor).toEqual(columns.reason);
        });
        test('adjustedGrade column', () => {
          const { Header, accessor } = out.columns[3];
          expect(Header).toEqual(messages.adjustedGradeHeader.defaultMessage);
          expect(accessor).toEqual(columns.adjustedGrade);
        });
      });
      test('data passed from grade data', () => {
        expect(out.data).toEqual(gradeOverrides);
      });
    });
    describe('with errors', () => {
      it('returns hide true and no other fields', () => {
        selectors.grades.useHasOverrideErrors.mockReturnValue(true);
        out = useOverrideTableData();
        expect(out).toEqual({ hide: true });
      });
    });
  });
});
