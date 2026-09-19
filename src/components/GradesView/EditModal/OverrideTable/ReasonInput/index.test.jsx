import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithAllProviders } from '@src/testUtils';
import { useGradebookUi } from '@src/data/gradebookUiContext';
import ReasonInput, { controlTestId } from '.';

jest.mock('@src/data/gradebookUiContext', () => ({
  ...jest.requireActual('@src/data/gradebookUiContext'),
  useGradebookUi: jest.fn(),
}));

describe('ReasonInput', () => {
  const setModalState = jest.fn();

  const setup = ({ reasonForChange = '' } = {}) => {
    useGradebookUi.mockReturnValue({
      modalState: { reasonForChange },
      setModalState,
    });
    return renderWithAllProviders(<ReasonInput />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the input with the current reason value', () => {
    setup({ reasonForChange: 'Late submission' });
    expect(screen.getByTestId(controlTestId)).toHaveValue('Late submission');
  });

  it('focuses the input on mount', () => {
    setup();
    expect(screen.getByTestId(controlTestId)).toHaveFocus();
  });

  it('updates modal state when the input changes', async () => {
    setup({ reasonForChange: 'Late' });
    await userEvent.type(screen.getByTestId(controlTestId), '!');
    expect(setModalState).toHaveBeenCalledWith({ reasonForChange: 'Late!' });
  });
});
