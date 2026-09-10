import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithAllProviders } from '@src/testUtils';
import { useGradeData } from '../data/hooks';
import { useGradebookUi } from '@src/data/gradebookUiContext';
import { ScoreViewInput } from '.';

jest.mock('../data/hooks', () => ({
  ...jest.requireActual('../data/hooks'),
  useGradeData: jest.fn(),
}));
jest.mock('@src/data/gradebookUiContext', () => ({
  ...jest.requireActual('@src/data/gradebookUiContext'),
  useGradebookUi: jest.fn(),
}));

describe('ScoreViewInput', () => {
  const setGradeFormat = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useGradeData.mockReturnValue({ gradeFormat: 'percent' });
    useGradebookUi.mockReturnValue({ setGradeFormat });
  });

  it('renders the score view label', () => {
    renderWithAllProviders(<ScoreViewInput />);
    expect(screen.getByLabelText(/score view/i)).toBeInTheDocument();
  });

  it('shows percent and absolute options', () => {
    renderWithAllProviders(<ScoreViewInput />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('percent');
    expect(select.querySelectorAll('option')).toHaveLength(2);
  });

  it('calls setGradeFormat when the selection changes', async () => {
    renderWithAllProviders(<ScoreViewInput />);
    await userEvent.selectOptions(screen.getByRole('combobox'), 'absolute');
    expect(setGradeFormat).toHaveBeenCalledWith('absolute');
  });
});
