import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithAllProviders } from '@src/testUtils';
import { useGradebookUi } from '@src/data/gradebookUiContext';
import { useEditModalPossibleGrade } from '@src/components/GradesView/data/hooks';
import { getLocalizedSlash } from '@src/i18n/utils';
import messages from '../messages';
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

  const mockData = ({ adjustedGradeValue = '75', possibleGrade = 100 } = {}) => {
    useGradebookUi.mockReturnValue({
      modalState: { adjustedGradeValue },
      setModalState,
    });
    useEditModalPossibleGrade.mockReturnValue(possibleGrade);
    getLocalizedSlash.mockReturnValue('/');
  };

  const setup = (data) => {
    mockData(data);
    return renderWithAllProviders(<AdjustedGradeInput />);
  };

  const invalidMessage = messages.adjustedGradeInvalid.defaultMessage;

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

  it('marks the field as required', () => {
    setup();
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-required', 'true');
  });

  it('shows no message for an empty field', () => {
    const { container } = setup({ adjustedGradeValue: '' });
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'false');
    expect(container.querySelector('[aria-live="polite"]')).toBeEmptyDOMElement();
  });

  it('marks a non-number as invalid and describes the field with the error', () => {
    setup({ adjustedGradeValue: 'abc' });
    const input = screen.getByRole('textbox', { description: invalidMessage });
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('warns about a grade above the possible grade without marking it invalid', () => {
    setup({ adjustedGradeValue: '110', possibleGrade: 100 });
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'false');
    expect(screen.getByText(
      "110 is more than the available number of points for this assignment (100). Are you sure you'd like to proceed?",
    )).toBeInTheDocument();
  });

  it('announces the message through a live region that exists before the message appears', () => {
    const { container, rerender } = setup();
    const liveRegion = container.querySelector('[aria-live="polite"]');
    expect(liveRegion).toBeEmptyDOMElement();
    mockData({ adjustedGradeValue: 'abc' });
    rerender(<AdjustedGradeInput />);
    expect(container.querySelector('[aria-live="polite"]')).toBe(liveRegion);
    expect(liveRegion).toHaveTextContent(invalidMessage);
  });
});
