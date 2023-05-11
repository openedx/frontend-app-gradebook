import { useIntl } from '@edx/frontend-platform/i18n';

import { formatMessage } from 'testUtils';
import { selectors, thunkActions } from 'data/redux/hooks';

import usePageButtonsData from './hooks';
import messages from './messages';

jest.mock('data/redux/hooks', () => ({
  selectors: {
    grades: { useGradeData: jest.fn() },
  },
  thunkActions: {
    grades: { useFetchPrevNextGrades: jest.fn() },
  },
}));

const gradeData = { nextPage: 'test-next-page', prevPage: 'test-prev-page' };
selectors.grades.useGradeData.mockReturnValue(gradeData);

const fetchGrades = jest.fn();
thunkActions.grades.useFetchPrevNextGrades.mockReturnValue(fetchGrades);

let out;
describe('usePageButtonsData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    out = usePageButtonsData();
  });
  describe('behavior', () => {
    it('initializes intl hook', () => {
      expect(useIntl).toHaveBeenCalled();
    });
    it('initializes redux hooks', () => {
      expect(selectors.grades.useGradeData).toHaveBeenCalled();
      expect(thunkActions.grades.useFetchPrevNextGrades).toHaveBeenCalled();
    });
  });
  describe('output', () => {
    describe('prev button entry', () => {
      it('is disabled iff prevPage is not provided', () => {
        expect(out.prev.disabled).toEqual(false);
        selectors.grades.useGradeData.mockReturnValueOnce({
          ...gradeData,
          prevPage: undefined,
        });
        out = usePageButtonsData();
        expect(out.prev.disabled).toEqual(true);
      });
      it('calls fetch with prevPage on click', () => {
        out.prev.onClick();
        expect(fetchGrades).toHaveBeenCalledWith(gradeData.prevPage);
      });
      test('text display', () => {
        expect(out.prev.text).toEqual(formatMessage(messages.prevPage));
      });
    });
    describe('next button entry', () => {
      it('is disabled iff nextPage is not provided', () => {
        expect(out.next.disabled).toEqual(false);
        selectors.grades.useGradeData.mockReturnValueOnce({
          ...gradeData,
          nextPage: undefined,
        });
        out = usePageButtonsData();
        expect(out.next.disabled).toEqual(true);
      });
      it('calls fetch with prevPage on click', () => {
        out.next.onClick();
        expect(fetchGrades).toHaveBeenCalledWith(gradeData.nextPage);
      });
      test('text display', () => {
        expect(out.next.text).toEqual(formatMessage(messages.nextPage));
      });
    });
  });
});
