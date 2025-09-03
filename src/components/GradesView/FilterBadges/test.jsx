/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-named-as-default */
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import FilterBadges from '.';

jest.unmock('@openedx/paragon');
jest.unmock('react');

const order = ['filter1', 'filter2', 'filter3'];
jest.mock('data/constants/filters', () => ({
  ...jest.requireActual('data/constants/filters'),
  badgeOrder: order,
}));

// eslint-disable-next-line react/button-has-type
jest.mock('./FilterBadge', () => jest.fn(({ filterName, handleClose }) => <button onClick={handleClose}>{filterName}</button>));

const handleClose = jest.fn();

describe('FilterBadges', () => {
  describe('component', () => {
    it('has a filterbadge with handleClose for each filter in badgeOrder', async () => {
      render(<FilterBadges handleClose={handleClose} />);
      const user = userEvent.setup();
      const badge1 = screen.getByText(order[0]);
      const badge2 = screen.getByText(order[1]);
      const badge3 = screen.getByText(order[2]);
      expect(badge1).toBeInTheDocument();
      expect(badge2).toBeInTheDocument();
      expect(badge3).toBeInTheDocument();
      await user.click(badge1);
      expect(handleClose).toHaveBeenCalled();
    });
  });
});
