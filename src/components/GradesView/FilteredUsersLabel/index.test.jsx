import { render, screen } from '@testing-library/react';

import { IntlProvider } from '@edx/frontend-platform/i18n';

import { selectors } from 'data/redux/hooks';

import FilteredUsersLabel from '.';

jest.unmock('@openedx/paragon');
jest.unmock('react');
jest.unmock('@edx/frontend-platform/i18n');

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
      render(<IntlProvider locale="en"><FilteredUsersLabel /></IntlProvider>);
      expect(selectors.grades.useUserCounts).toHaveBeenCalled();
    });
  });
  describe('render', () => {
    it('null render if totalUsersCount is 0', () => {
      selectors.grades.useUserCounts.mockReturnValueOnce({
        ...userCounts,
        totalUsersCount: 0,
      });
      const { container } = render(<IntlProvider locale="en"><FilteredUsersLabel /></IntlProvider>);
      expect(container.firstChild).toBeNull();
    });
    it('renders correctly', () => {
      render(<IntlProvider locale="en"><FilteredUsersLabel /></IntlProvider>);
      expect(screen.getByText((text) => text.includes(userCounts.filteredUsersCount))).toBeInTheDocument();
      expect(screen.getByText((text) => text.includes(userCounts.totalUsersCount))).toBeInTheDocument();
    });
  });
});
