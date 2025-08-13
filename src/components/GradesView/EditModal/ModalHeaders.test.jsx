import React from 'react';
import { selectors } from 'data/redux/hooks';

import { render, screen, initializeMocks } from 'testUtilsExtra';
import ModalHeaders from './ModalHeaders';

jest.unmock('@openedx/paragon');
jest.unmock('react');
jest.unmock('@edx/frontend-platform/i18n');

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
initializeMocks();

describe('ModalHeaders', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    render(<ModalHeaders />);
  });
  describe('render', () => {
    test('assignment header', () => {
      expect(screen.getByText(modalData.assignmentName)).toBeInTheDocument();
    });
    test('student header', () => {
      expect(screen.getByText(modalData.updateUserName)).toBeInTheDocument();
    });
    test('originalGrade header', () => {
      expect(screen.getByText(gradeData.gradeOriginalEarnedGraded)).toBeInTheDocument();
    });
    test('currentGrade header', () => {
      expect(screen.getByText(gradeData.gradeOverrideCurrentEarnedGradedOverride)).toBeInTheDocument();
    });
  });
});
