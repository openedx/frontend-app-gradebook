import { screen } from '@testing-library/react';

import { renderWithAllProviders } from '@src/testUtils';
import { useCourseGradeFilterValidity } from '@src/components/GradebookFilters/data/hooks';
import { useGradebookUi } from '@src/data/gradebookUiContext';
import StatusAlerts from '.';

jest.mock('@src/components/GradebookFilters/data/hooks', () => ({
  ...jest.requireActual('@src/components/GradebookFilters/data/hooks'),
  useCourseGradeFilterValidity: jest.fn(),
}));
jest.mock('@src/data/gradebookUiContext', () => ({
  ...jest.requireActual('@src/data/gradebookUiContext'),
  useGradebookUi: jest.fn(),
}));

describe('StatusAlerts', () => {
  const setShowSuccess = jest.fn();

  const setup = ({ isMinValid = true, isMaxValid = true, showSuccess = false } = {}) => {
    useCourseGradeFilterValidity.mockReturnValue({ isMinValid, isMaxValid });
    useGradebookUi.mockReturnValue({ showSuccess, setShowSuccess });
    return renderWithAllProviders(<StatusAlerts />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows the success banner when showSuccess is true', () => {
    setup({ showSuccess: true });
    const alerts = screen.getAllByRole('alert');
    expect(alerts[0]).toHaveClass('alert-success');
  });

  it('hides the success banner when showSuccess is false', () => {
    setup({ showSuccess: false });
    expect(screen.queryByText(/edit success/i)).not.toBeInTheDocument();
  });

  it('shows the grade filter error alert when the min is invalid', () => {
    setup({ isMinValid: false });
    const alerts = screen.getAllByRole('alert');
    expect(alerts[alerts.length - 1]).toHaveClass('alert-danger');
  });

  it('shows the grade filter error alert when the max is invalid', () => {
    setup({ isMaxValid: false });
    const alerts = screen.getAllByRole('alert');
    expect(alerts[alerts.length - 1]).toHaveClass('alert-danger');
  });
});
