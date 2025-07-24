import { fireEvent, render, screen } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { formatMessage } from 'testUtils';
import { thunkActions } from 'data/redux/hooks';

import FilterMenuToggle from '.';
import messages from './messages';

jest.mock('data/redux/hooks', () => ({
  thunkActions: {
    app: {
      filterMenu: {
        useToggleMenu: jest.fn(),
      },
    },
  },
}));

jest.unmock('@openedx/paragon');
jest.unmock('react');
jest.unmock('@edx/frontend-platform/i18n');

const toggleFilterMenu = jest.fn().mockName('hooks.toggleFilterMenu');
thunkActions.app.filterMenu.useToggleMenu.mockReturnValue(toggleFilterMenu);

describe('FilterMenuToggle component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    render(<IntlProvider locale="en"><FilterMenuToggle /></IntlProvider>);
  });
  describe('behavior', () => {
    it('initializes redux hooks', () => {
      expect(thunkActions.app.filterMenu.useToggleMenu).toHaveBeenCalled();
    });
  });
  describe('renders', () => {
    it('button and triggers click', () => {
      const button = screen.getByRole('button', { name: formatMessage(messages.editFilters) });
      expect(button).toBeInTheDocument();
      fireEvent.click(button);
      expect(toggleFilterMenu).toHaveBeenCalled();
    });
  });
});
