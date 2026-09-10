import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithAllProviders } from '@src/testUtils';
import { useGradebookUi } from '@src/data/gradebookUiContext';
import FilterMenuToggle from '.';
import messages from './messages';

jest.mock('@src/data/gradebookUiContext', () => ({
  ...jest.requireActual('@src/data/gradebookUiContext'),
  useGradebookUi: jest.fn(),
}));

describe('FilterMenuToggle', () => {
  const toggleFilterMenu = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useGradebookUi.mockReturnValue({ toggleFilterMenu });
  });

  it('renders the edit-filters button', () => {
    renderWithAllProviders(<FilterMenuToggle />);
    expect(
      screen.getByRole('button', { name: messages.editFilters.defaultMessage }),
    ).toBeInTheDocument();
  });

  it('calls toggleFilterMenu when clicked', async () => {
    renderWithAllProviders(<FilterMenuToggle />);
    await userEvent.click(
      screen.getByRole('button', { name: messages.editFilters.defaultMessage }),
    );
    expect(toggleFilterMenu).toHaveBeenCalled();
  });
});
