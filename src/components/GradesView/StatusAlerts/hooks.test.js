import { useIntl } from '@edx/frontend-platform/i18n';

import { formatMessage } from 'testUtils';
import { actions, selectors } from 'data/redux/hooks';

import useStatusAlertsData from './hooks';
import messages from './messages';

jest.mock('data/redux/hooks', () => ({
  actions: {
    grades: { useCloseBanner: jest.fn() },
  },
  selectors: {
    app: { useCourseGradeFilterValidity: jest.fn() },
    grades: { useShowSuccess: jest.fn() },
  },
}));

const validity = {
  isMinValid: true,
  isMaxValid: true,
};
selectors.app.useCourseGradeFilterValidity.mockReturnValue(validity);
const showSuccess = 'test-show-success';
selectors.grades.useShowSuccess.mockReturnValue(showSuccess);
const closeBanner = jest.fn().mockName('hooks.closeBanner');
actions.grades.useCloseBanner.mockReturnValue(closeBanner);

let out;
describe('useStatusAlertsData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    out = useStatusAlertsData();
  });
  describe('behavior', () => {
    it('initializes intl hook', () => {
      expect(useIntl).toHaveBeenCalled();
    });
    it('initializes redux hooks', () => {
      expect(actions.grades.useCloseBanner).toHaveBeenCalled();
      expect(selectors.app.useCourseGradeFilterValidity).toHaveBeenCalled();
      expect(selectors.grades.useShowSuccess).toHaveBeenCalled();
    });
  });
  describe('output', () => {
    describe('successBanner', () => {
      test('onClose and show from redux', () => {
        expect(out.successBanner.onClose).toEqual(closeBanner);
        expect(out.successBanner.show).toEqual(showSuccess);
      });
      test('message', () => {
        expect(out.successBanner.text).toEqual(formatMessage(messages.editSuccessAlert));
      });
    });
    describe('gradeFilter', () => {
      describe('both filters are valid', () => {
        test('do not show', () => {
          expect(out.gradeFilter.show).toEqual(false);
        });
      });
      describe('min filter is invalid', () => {
        beforeEach(() => {
          selectors.app.useCourseGradeFilterValidity.mockReturnValue({
            isMinValid: false,
            isMaxValid: true,
          });
          out = useStatusAlertsData();
        });
        test('show grade filter banner', () => {
          expect(out.gradeFilter.show).toEqual(true);
        });
        test('filter message', () => {
          expect(out.gradeFilter.text).toEqual(formatMessage(messages.minGradeInvalid));
        });
      });
      describe('max filter is invalid', () => {
        beforeEach(() => {
          selectors.app.useCourseGradeFilterValidity.mockReturnValue({
            isMinValid: true,
            isMaxValid: false,
          });
          out = useStatusAlertsData();
        });
        test('show grade filter banner', () => {
          expect(out.gradeFilter.show).toEqual(true);
        });
        test('filter message', () => {
          expect(out.gradeFilter.text).toEqual(formatMessage(messages.maxGradeInvalid));
        });
      });
      describe('both filters are invalid', () => {
        beforeEach(() => {
          selectors.app.useCourseGradeFilterValidity.mockReturnValue({
            isMinValid: false,
            isMaxValid: false,
          });
          out = useStatusAlertsData();
        });
        test('show grade filter banner', () => {
          expect(out.gradeFilter.show).toEqual(true);
        });
        test('filter message', () => {
          expect(out.gradeFilter.text).toEqual(
            `${formatMessage(messages.minGradeInvalid)}${formatMessage(messages.maxGradeInvalid)}`,
          );
        });
      });
    });
  });
});
