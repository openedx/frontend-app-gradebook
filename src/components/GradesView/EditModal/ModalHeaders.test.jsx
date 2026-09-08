import React from 'react';
import { screen } from '@testing-library/react';

import { renderWithAllProviders } from '@src/testUtils';
import { useGradebookUi } from '@src/data/gradebookUiContext';
import { useGradeOverrideData } from '@src/components/GradesView/data/hooks';
import ModalHeaders from './ModalHeaders';

jest.mock('@src/data/gradebookUiContext', () => ({
  ...jest.requireActual('@src/data/gradebookUiContext'),
  useGradebookUi: jest.fn(),
}));
jest.mock('@src/components/GradesView/data/hooks', () => ({
  ...jest.requireActual('@src/components/GradesView/data/hooks'),
  useGradeOverrideData: jest.fn(),
}));

describe('ModalHeaders', () => {
  const modalState = {
    assignmentName: 'test-assignment-name',
    updateUserName: 'test-user-name',
  };
  const overrideData = {
    gradeOverrideCurrentEarnedGradedOverride: 'test-current-grade',
    gradeOriginalEarnedGraded: 'test-original-grade',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useGradebookUi.mockReturnValue({ modalState });
    useGradeOverrideData.mockReturnValue(overrideData);
    renderWithAllProviders(<ModalHeaders />);
  });

  it('renders the assignment name', () => {
    expect(screen.getByText(modalState.assignmentName)).toBeInTheDocument();
  });
  it('renders the student name', () => {
    expect(screen.getByText(modalState.updateUserName)).toBeInTheDocument();
  });
  it('renders the original grade', () => {
    expect(screen.getByText(overrideData.gradeOriginalEarnedGraded)).toBeInTheDocument();
  });
  it('renders the current override grade', () => {
    expect(screen.getByText(overrideData.gradeOverrideCurrentEarnedGradedOverride)).toBeInTheDocument();
  });
});
