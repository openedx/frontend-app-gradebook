/* eslint-disable import/no-named-as-default */
import React from 'react';
import { shallow } from 'enzyme';

import * as constants from 'data/constants/filters';
import FilterBadges from '.';
import FilterBadge from './FilterBadge';

jest.mock('./FilterBadge', () => 'FilterBadge');

describe('FilterBadges', () => {
  describe('component', () => {
    let el;
    let handleClose;
    const order = ['filter1', 'filter2', 'filter3'];
    beforeEach(() => {
      handleClose = jest.fn().mockName('this.props.handleClose');
      constants.badgeOrder = order;
      el = shallow(<FilterBadges handleClose={handleClose} />);
    });
    test('snapshot - has a filterbadge with handleClose for each filter in badgeOrder', () => {
      expect(el).toMatchSnapshot();
    });
    test('has a filterbadge with handleClose for each filter in badgeOrder', () => {
      const badgeProps = el.find(FilterBadge).map(badgeEl => badgeEl.props());
      // key prop is not rendered by react
      expect(badgeProps[0]).toEqual({ filterName: order[0], handleClose });
      expect(badgeProps[1]).toEqual({ filterName: order[1], handleClose });
      expect(badgeProps[2]).toEqual({ filterName: order[2], handleClose });
      expect(badgeProps.length).toEqual(3);
    });
  });
});
