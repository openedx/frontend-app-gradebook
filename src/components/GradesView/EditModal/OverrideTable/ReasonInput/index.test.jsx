import React from 'react';
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

  const setup = ({ reasonForChange = 'because' } = {}) => {
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
    setup({ reasonForChange: 'good enough' });
    expect(screen.getByTestId(controlTestId)).toHaveValue('good enough');
  });

  it('focuses the input on mount', () => {
    setup();
    expect(screen.getByTestId(controlTestId)).toHaveFocus();
  });

  it('updates modal state when the input changes', async () => {
    setup({ reasonForChange: '' });
    await userEvent.type(screen.getByTestId(controlTestId), 'x');
    expect(setModalState).toHaveBeenCalledWith({ reasonForChange: 'x' });
  });
});
