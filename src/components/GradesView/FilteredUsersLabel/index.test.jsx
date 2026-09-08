import { screen } from '@testing-library/react';

import { renderWithAllProviders } from '@src/testUtils';
import { useUserCounts } from '../data/hooks';
import FilteredUsersLabel from '.';

jest.mock('../data/hooks', () => ({
  ...jest.requireActual('../data/hooks'),
  useUserCounts: jest.fn(),
}));

describe('FilteredUsersLabel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders null when totalUsersCount is 0', () => {
    useUserCounts.mockReturnValue({ filteredUsersCount: 0, totalUsersCount: 0 });
    const { container } = renderWithAllProviders(<FilteredUsersLabel />);
    expect(container.firstChild).toBeNull();
  });

  it('renders both filtered and total counts', () => {
    useUserCounts.mockReturnValue({ filteredUsersCount: 100, totalUsersCount: 123 });
    renderWithAllProviders(<FilteredUsersLabel />);
    expect(screen.getByText((text) => text.includes('100'))).toBeInTheDocument();
    expect(screen.getByText((text) => text.includes('123'))).toBeInTheDocument();
  });
});
