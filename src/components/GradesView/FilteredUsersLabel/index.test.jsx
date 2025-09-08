import { screen } from '@testing-library/react';

import { selectors } from 'data/redux/hooks';

import FilteredUsersLabel from '.';
import { renderWithIntl } from '../../../testUtilsExtra';

jest.mock('data/redux/hooks', () => ({
  selectors: {
    grades: {
      useUserCounts: jest.fn(),
    },
  },
}));

const userCounts = {
  filteredUsersCount: 100,
  totalUsersCount: 123,
};
selectors.grades.useUserCounts.mockReturnValue(userCounts);

describe('FilteredUsersLabel component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('behavior', () => {
    it('initializes redux hooks', () => {
      renderWithIntl(<FilteredUsersLabel />);
      expect(selectors.grades.useUserCounts).toHaveBeenCalled();
    });
  });
  describe('render', () => {
    it('null render if totalUsersCount is 0', () => {
      selectors.grades.useUserCounts.mockReturnValueOnce({
        ...userCounts,
        totalUsersCount: 0,
      });
      const { container } = renderWithIntl(<FilteredUsersLabel />);
      expect(container.firstChild).toBeNull();
    });
    it('renders users count correctly', () => {
      renderWithIntl(<FilteredUsersLabel />);
      expect(screen.getByText((text) => text.includes(userCounts.filteredUsersCount))).toBeInTheDocument();
      expect(screen.getByText((text) => text.includes(userCounts.totalUsersCount))).toBeInTheDocument();
    });
  });
});
