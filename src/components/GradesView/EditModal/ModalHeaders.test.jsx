import React from 'react';
import { shallow } from '@edx/react-unit-test-utils';

import { useIntl } from '@edx/frontend-platform/i18n';
import { selectors } from 'data/redux/hooks';

import { formatMessage } from 'testUtils';

import HistoryHeader from './HistoryHeader';
import ModalHeaders, { HistoryKeys } from './ModalHeaders';
import messages from './messages';

jest.mock('./HistoryHeader', () => 'HistoryHeader');

jest.mock('data/redux/hooks', () => ({
  selectors: {
    app: { useModalData: jest.fn() },
    grades: { useGradeData: jest.fn() },
  },
}));

const modalData = {
  assignmentName: 'test-assignment-name',
  updateUserName: 'test-user-name',
};
selectors.app.useModalData.mockReturnValue(modalData);
const gradeData = {
  gradeOverrideCurrentEarnedGradedOverride: 'test-current-grade',
  gradeOriginalEarnedGraded: 'test-original-grade',
};
selectors.grades.useGradeData.mockReturnValue(gradeData);

let el;
describe('ModalHeaders', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    el = shallow(<ModalHeaders />);
  });
  describe('behavior', () => {
    it('initializes intl', () => {
      expect(useIntl).toHaveBeenCalled();
    });
    it('initializes redux hooks', () => {
      expect(selectors.app.useModalData).toHaveBeenCalled();
      expect(selectors.grades.useGradeData).toHaveBeenCalled();
    });
  });
  describe('render', () => {
    test('snapshot', () => {
      expect(el.snapshot).toMatchSnapshot();
    });
    test('assignment header', () => {
      const headerProps = el.instance.findByType(HistoryHeader)[0].props;
      expect(headerProps).toMatchObject({
        id: HistoryKeys.assignment,
        label: formatMessage(messages.assignmentHeader),
        value: modalData.assignmentName,
      });
    });
    test('student header', () => {
      const headerProps = el.instance.findByType(HistoryHeader)[1].props;
      expect(headerProps).toMatchObject({
        id: HistoryKeys.student,
        label: formatMessage(messages.studentHeader),
        value: modalData.updateUserName,
      });
    });
    test('originalGrade header', () => {
      const headerProps = el.instance.findByType(HistoryHeader)[2].props;
      expect(headerProps).toMatchObject({
        id: HistoryKeys.originalGrade,
        label: formatMessage(messages.originalGradeHeader),
        value: gradeData.gradeOriginalEarnedGraded,
      });
    });
    test('currentGrade header', () => {
      const headerProps = el.instance.findByType(HistoryHeader)[3].props;
      expect(headerProps).toMatchObject({
        id: HistoryKeys.currentGrade,
        label: formatMessage(messages.currentGradeHeader),
        value: gradeData.gradeOverrideCurrentEarnedGradedOverride,
      });
    });
  });
});
