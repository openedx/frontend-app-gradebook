import React from 'react';
import { screen } from '@testing-library/react';

import { formatMessage } from 'testUtils';
import { selectors } from 'data/redux/hooks';
import userEvent from '@testing-library/user-event';
import FilterBadge from './FilterBadge';
import { renderWithIntl } from '../../../testUtilsExtra';

jest.mock('data/redux/hooks', () => ({
  selectors: {
    root: {
      useFilterBadgeConfig: jest.fn(),
    },
  },
}));

const handleClose = jest.fn();
const filterName = 'test-filter-name';

const hookProps = {
  displayName: {
    id: 'test.id',
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
      renderWithIntl(<FilterBadge {...{ handleClose, filterName }} />);
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
      renderWithIntl(<FilterBadge {...{ handleClose, filterName }} />);
      expect(screen.queryByText(hookProps.displayName)).toBeNull();
    });
    describe('hide Value', () => {
      it('renders display name, value is not shown and close button has correct behavior', async () => {
        selectors.root.useFilterBadgeConfig.mockReturnValueOnce({
          ...hookProps,
          hideValue: true,
        });
        renderWithIntl(<FilterBadge {...{ handleClose, filterName }} />);
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
        renderWithIntl(<FilterBadge {...{ handleClose, filterName }} />);
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
