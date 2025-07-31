import React from 'react';
import { render, screen } from '@testing-library/react';
import { useIntl } from '@edx/frontend-platform/i18n';

import { formatMessage } from 'testUtils';
import { selectors } from 'data/redux/hooks';
import userEvent from '@testing-library/user-event';
import FilterBadge from './FilterBadge';

jest.mock('@openedx/paragon', () => ({
  Button: () => 'Button',
}));
jest.mock('data/redux/hooks', () => ({
  selectors: {
    root: {
      useFilterBadgeConfig: jest.fn(),
    },
  },
}));

jest.unmock('@openedx/paragon');
jest.unmock('react');

const handleClose = jest.fn();
const filterName = 'test-filter-name';

const hookProps = {
  displayName: {
    defaultMessage: 'a common name',
  },
  isDefault: false,
  hideValue: false,
  value: 'a common value',
  connectedFilters: ['some', 'filters'],
};
selectors.root.useFilterBadgeConfig.mockReturnValue(hookProps);

describe('FilterBadge', () => {
  describe('hooks', () => {
    beforeEach(() => {
      render(<FilterBadge {...{ handleClose, filterName }} />);
    });
    it('initializes intl hook', () => {
      expect(useIntl).toHaveBeenCalled();
    });
    it('initializes redux hooks', () => {
      expect(selectors.root.useFilterBadgeConfig).toHaveBeenCalledWith(filterName);
    });
  });
  describe('render', () => {
    it('empty render if isDefault', () => {
      selectors.root.useFilterBadgeConfig.mockReturnValueOnce({
        ...hookProps,
        isDefault: true,
      });
      render(<FilterBadge {...{ handleClose, filterName }} />);
      expect(screen.queryByText(hookProps.displayName)).toBeNull();
    });
    describe('hide Value', () => {
      it('renders display name, value is not shown and close button has correct behavior', async () => {
        selectors.root.useFilterBadgeConfig.mockReturnValueOnce({
          ...hookProps,
          hideValue: true,
        });
        render(<FilterBadge {...{ handleClose, filterName }} />);
        const user = userEvent.setup();
        expect(screen.getByTestId('display-name')).toHaveTextContent(formatMessage(hookProps.displayName));
        expect(screen.queryByTestId('filter-value')).toHaveTextContent('');
        const button = screen.getByRole('button', { name: /close/i });
        await user.click(button);
        expect(handleClose).toHaveBeenCalledWith(hookProps.connectedFilters);
      });
    });
    describe('do not hide value', () => {
      it('renders display name and value, and close button has correct behavior', async () => {
        selectors.root.useFilterBadgeConfig.mockReturnValueOnce({
          ...hookProps,
          hideValue: false,
        });
        render(<FilterBadge {...{ handleClose, filterName }} />);
        const user = userEvent.setup();
        expect(screen.getByTestId('display-name')).toHaveTextContent(formatMessage(hookProps.displayName));
        expect(screen.getByTestId('filter-value')).toHaveTextContent(`: ${hookProps.value}`);
        const button = screen.getByRole('button', { name: /close/i });
        await user.click(button);
        expect(handleClose).toHaveBeenCalledWith(hookProps.connectedFilters);
      });
    });
  });
});
