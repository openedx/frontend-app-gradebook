import { screen } from '@testing-library/react';

import { renderWithAllProviders } from '@src/testUtils';
import { useGradebookUi } from '@src/data/gradebookUiContext';
import { BulkManagementAlerts } from './BulkManagementAlerts';

jest.mock('@src/data/gradebookUiContext', () => ({
  ...jest.requireActual('@src/data/gradebookUiContext'),
  useGradebookUi: jest.fn(),
}));

const setup = ({ csvUploadSuccess = false, csvUploadErrorMessages = [] } = {}) => {
  useGradebookUi.mockReturnValue({ csvUploadSuccess, csvUploadErrorMessages });
  return renderWithAllProviders(<BulkManagementAlerts />);
};

describe('BulkManagementAlerts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders no visible alerts by default', () => {
    setup();
    expect(document.querySelectorAll('.alert.show').length).toBe(0);
  });

  it('shows the success alert when csvUploadSuccess is true', () => {
    setup({ csvUploadSuccess: true });
    expect(document.querySelectorAll('.alert-success.show').length).toBe(1);
  });

  it('shows the error alert with joined error messages', () => {
    setup({ csvUploadErrorMessages: ['bad file', 'other error'] });
    expect(document.querySelectorAll('.alert-danger.show').length).toBe(1);
    expect(
      screen.getByText(/Errors while processing: bad file; other error;/),
    ).toBeInTheDocument();
  });
});
