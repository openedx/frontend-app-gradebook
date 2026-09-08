import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithAllProviders } from '@src/testUtils';
import { useGradebookUi } from '@src/data/gradebookUiContext';
import { useEditModalPossibleGrade } from '@src/components/GradesView/data/hooks';
import { getLocalizedSlash } from '@src/i18n/utils';
import AdjustedGradeInput from '.';

jest.mock('@src/data/gradebookUiContext', () => ({
  ...jest.requireActual('@src/data/gradebookUiContext'),
  useGradebookUi: jest.fn(),
}));
jest.mock('@src/components/GradesView/data/hooks', () => ({
  ...jest.requireActual('@src/components/GradesView/data/hooks'),
  useEditModalPossibleGrade: jest.fn(),
}));
jest.mock('@src/i18n/utils', () => ({
  ...jest.requireActual('@src/i18n/utils'),
  getLocalizedSlash: jest.fn(),
}));

describe('AdjustedGradeInput', () => {
  const setModalState = jest.fn();

  const setup = ({ adjustedGradeValue = '75', possibleGrade = 100 } = {}) => {
    useGradebookUi.mockReturnValue({
      modalState: { adjustedGradeValue },
      setModalState,
    });
    useEditModalPossibleGrade.mockReturnValue(possibleGrade);
    getLocalizedSlash.mockReturnValue('/');
    return renderWithAllProviders(<AdjustedGradeInput />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the input with the current adjusted grade value', () => {
    setup({ adjustedGradeValue: '82' });
    expect(screen.getByRole('textbox')).toHaveValue('82');
  });

  it('renders the possible-grade hint when a possible grade is provided', () => {
    setup({ possibleGrade: 100 });
    expect(screen.getByText(/\/ 100/)).toBeInTheDocument();
  });

  it('omits the hint text when there is no possible grade', () => {
    setup({ possibleGrade: null });
    expect(screen.queryByText(/\/ /)).not.toBeInTheDocument();
  });

  it('updates modal state when the input changes', async () => {
    setup();
    await userEvent.type(screen.getByRole('textbox'), '9');
    expect(setModalState).toHaveBeenCalledWith({ adjustedGradeValue: '759' });
  });
});
