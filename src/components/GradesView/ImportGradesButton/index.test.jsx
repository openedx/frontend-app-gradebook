import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithAllProviders } from '@src/testUtils';
import { useSubmitImportGradesButtonData } from '../data/apiHook';
import { useGradeExportUrl } from '../data/hooks';
import ImportGradesButton from '.';
import messages from './messages';

jest.mock('../data/apiHook', () => ({
  ...jest.requireActual('../data/apiHook'),
  useSubmitImportGradesButtonData: jest.fn(),
}));
jest.mock('../data/hooks', () => ({
  ...jest.requireActual('../data/hooks'),
  useGradeExportUrl: jest.fn(),
}));
jest.mock('@src/components/NetworkButton', () => ({ onClick, label }) => (
    <button type="button" onClick={onClick} data-testid="network-button">
      {label.defaultMessage}
    </button>
  ));

describe('ImportGradesButton', () => {
  const submit = jest.fn(() => Promise.resolve());

  beforeEach(() => {
    jest.clearAllMocks();
    useGradeExportUrl.mockReturnValue('https://example.com/grades.csv');
    useSubmitImportGradesButtonData.mockReturnValue(submit);
  });

  it('renders the hidden file input and the import button', () => {
    renderWithAllProviders(<ImportGradesButton />);
    expect(screen.getByTestId('file-control')).toBeInTheDocument();
    expect(screen.getByTestId('network-button')).toHaveTextContent(
      messages.importGradesBtnText.defaultMessage,
    );
  });

  it('opens the file picker when the button is clicked', async () => {
    renderWithAllProviders(<ImportGradesButton />);
    const fileInput = screen.getByTestId('file-control');
    const clickSpy = jest.spyOn(fileInput, 'click');

    await userEvent.click(screen.getByTestId('network-button'));

    expect(clickSpy).toHaveBeenCalled();
  });

  it('submits the selected file through the import hook', async () => {
    // Return a promise that never resolves so the `.then(clearInput)` chain
    // doesn't race with user-event resetting the input during teardown.
    const pending = new Promise(() => {});
    submit.mockReturnValueOnce(pending);
    renderWithAllProviders(<ImportGradesButton />);
    const fileInput = screen.getByTestId('file-control');
    const file = new File(['csv'], 'grades.csv', { type: 'text/csv' });

    await userEvent.upload(fileInput, file);

    expect(submit).toHaveBeenCalledTimes(1);
    const formData = submit.mock.calls[0][0];
    expect(formData).toBeInstanceOf(FormData);
    expect(formData.get('csv')).toBe(file);
  });
});
