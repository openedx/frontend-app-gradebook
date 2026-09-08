import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithAllProviders } from '@src/testUtils';
import { useGradebookUi } from '@src/data/gradebookUiContext';
import { useGradeOverrideData } from '@src/components/GradesView/data/hooks';
import { useUpdateGrades } from '@src/components/GradesView/data/apiHook';
import EditModal from '.';
import messages from './messages';

jest.mock('@src/data/gradebookUiContext', () => ({
  ...jest.requireActual('@src/data/gradebookUiContext'),
  useGradebookUi: jest.fn(),
}));
jest.mock('@src/components/GradesView/data/hooks', () => ({
  ...jest.requireActual('@src/components/GradesView/data/hooks'),
  useGradeOverrideData: jest.fn(),
}));
jest.mock('@src/components/GradesView/data/apiHook', () => ({
  ...jest.requireActual('@src/components/GradesView/data/apiHook'),
  useUpdateGrades: jest.fn(),
}));
jest.mock('./ModalHeaders', () => () => <div>ModalHeaders</div>);
jest.mock('./OverrideTable', () => () => <div>OverrideTable</div>);

describe('EditModal', () => {
  const closeModal = jest.fn();
  const updateGrades = jest.fn();

  const setup = ({ error = undefined, isOpen = true } = {}) => {
    useGradebookUi.mockReturnValue({
      modalState: { open: isOpen },
      closeModal,
    });
    useGradeOverrideData.mockReturnValue({ gradeOverrideHistoryError: error });
    useUpdateGrades.mockReturnValue(updateGrades);
    return renderWithAllProviders(<EditModal />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the dialog with headers, table, and visibility messages', () => {
    setup();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('ModalHeaders')).toBeInTheDocument();
    expect(screen.getByText('OverrideTable')).toBeInTheDocument();
    expect(screen.getByText(messages.visibility.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.saveVisibility.defaultMessage)).toBeInTheDocument();
  });

  it('does not render the error alert when there is no error', () => {
    setup({ error: undefined });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('renders the error alert when an override error is present', () => {
    setup({ error: 'oh no' });
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent('oh no');
  });

  it('closes the modal when the close button is clicked', async () => {
    setup();
    await userEvent.click(screen.getByRole('button', { name: messages.closeText.defaultMessage }));
    expect(closeModal).toHaveBeenCalled();
  });

  it('updates grades and closes on save', async () => {
    setup();
    await userEvent.click(screen.getByRole('button', { name: messages.saveGrade.defaultMessage }));
    expect(updateGrades).toHaveBeenCalled();
    expect(closeModal).toHaveBeenCalled();
  });
});
