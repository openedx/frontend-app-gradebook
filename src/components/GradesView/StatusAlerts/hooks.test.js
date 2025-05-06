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
    app: {
      useCourseGradeFilterValidity: jest.fn(),
      useAssignmentGradeFilterValidity: jest.fn(),
    },
    grades: { useShowSuccess: jest.fn() },
  },
}));

const validity = {
  isMinValid: true,
  isMaxValid: true,
  isMinLessMaxValid: true,
};
selectors.app.useCourseGradeFilterValidity.mockReturnValue(validity);
selectors.app.useAssignmentGradeFilterValidity.mockReturnValue(validity);
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
      expect(selectors.app.useAssignmentGradeFilterValidity).toHaveBeenCalled();
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
      describe('all filters are valid', () => {
        test('do not show', () => {
          expect(out.courseGradeFilter.show).toEqual(false);
          expect(out.assignmentGradeFilter.show).toEqual(false);
        });
      });
      describe('min filter is invalid', () => {
        beforeEach(() => {
          selectors.app.useCourseGradeFilterValidity.mockReturnValue({
            isMinValid: false,
            isMaxValid: true,
            isMinLessMaxValid: true,
          });
          selectors.app.useAssignmentGradeFilterValidity.mockReturnValue({
            isMinValid: false,
            isMaxValid: true,
            isMinLessMaxValid: true,
          });
          out = useStatusAlertsData();
        });
        test('show grade filter banner', () => {
          expect(out.courseGradeFilter.show).toEqual(true);
          expect(out.assignmentGradeFilter.show).toEqual(true);
        });
        test('filter message', () => {
          expect(out.courseGradeFilter.text).toEqual(`${formatMessage(messages.minGradeInvalid)}  `);
          expect(out.assignmentGradeFilter.text).toEqual(`${formatMessage(messages.minAssignmentInvalid)}  `);
        });
      });
      describe('max filter is invalid', () => {
        beforeEach(() => {
          selectors.app.useCourseGradeFilterValidity.mockReturnValue({
            isMinValid: true,
            isMaxValid: false,
            isMinLessMaxValid: true,
          });
          selectors.app.useAssignmentGradeFilterValidity.mockReturnValue({
            isMinValid: true,
            isMaxValid: false,
            isMinLessMaxValid: true,
          });
          out = useStatusAlertsData();
        });
        test('show grade filter banner', () => {
          expect(out.courseGradeFilter.show).toEqual(true);
          expect(out.assignmentGradeFilter.show).toEqual(true);
        });
        test('filter message', () => {
          expect(out.courseGradeFilter.text).toEqual(` ${formatMessage(messages.maxGradeInvalid)} `);
          expect(out.assignmentGradeFilter.text).toEqual(` ${formatMessage(messages.maxAssignmentInvalid)} `);
        });
      });
      describe('minLessMax filter is invalid', () => {
        beforeEach(() => {
          selectors.app.useCourseGradeFilterValidity.mockReturnValue({
            isMinValid: true,
            isMaxValid: true,
            isMinLessMaxValid: false,
          });
          selectors.app.useAssignmentGradeFilterValidity.mockReturnValue({
            isMinValid: true,
            isMaxValid: true,
            isMinLessMaxValid: false,
          });
          out = useStatusAlertsData();
        });
        test('show grade filter banner', () => {
          expect(out.courseGradeFilter.show).toEqual(true);
          expect(out.assignmentGradeFilter.show).toEqual(true);
        });
        test('filter message', () => {
          expect(out.courseGradeFilter.text).toEqual(`  ${formatMessage(messages.minLessMaxGradeInvalid)}`);
          expect(out.assignmentGradeFilter.text).toEqual(`  ${formatMessage(messages.minLessMaxAssignmentInvalid)}`);
        });
      });
      describe('all filters are invalid', () => {
        beforeEach(() => {
          selectors.app.useCourseGradeFilterValidity.mockReturnValue({
            isMinValid: false,
            isMaxValid: false,
            isMinLessMaxValid: false,
          });
          selectors.app.useAssignmentGradeFilterValidity.mockReturnValue({
            isMinValid: false,
            isMaxValid: false,
            isMinLessMaxValid: false,
          });
          out = useStatusAlertsData();
        });
        test('show grade filter banner', () => {
          expect(out.courseGradeFilter.show).toEqual(true);
          expect(out.assignmentGradeFilter.show).toEqual(true);
        });
        test('filter message', () => {
          expect(out.courseGradeFilter.text).toEqual(
            `${formatMessage(messages.minGradeInvalid)} ${formatMessage(messages.maxGradeInvalid)} ${formatMessage(messages.minLessMaxGradeInvalid)}`,
          );
          expect(out.assignmentGradeFilter.text).toEqual(
            `${formatMessage(messages.minAssignmentInvalid)} ${formatMessage(messages.maxAssignmentInvalid)} ${formatMessage(messages.minLessMaxAssignmentInvalid)}`,
          );
        });
      });
    });
  });
});
