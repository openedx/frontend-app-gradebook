import React from 'react';
import { shallow } from '@edx/react-unit-test-utils';

import { useIntl } from '@edx/frontend-platform/i18n';

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

const toggleFilterMenu = jest.fn().mockName('hooks.toggleFilterMenu');
thunkActions.app.filterMenu.useToggleMenu.mockReturnValue(toggleFilterMenu);

let el;
describe('FilterMenuToggle component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    el = shallow(<FilterMenuToggle />);
  });
  describe('behavior', () => {
    it('initializes intl hook', () => {
      expect(useIntl).toHaveBeenCalled();
    });
    it('initializes redux hooks', () => {
      expect(thunkActions.app.filterMenu.useToggleMenu).toHaveBeenCalled();
    });
  });
  describe('render', () => {
    test('snapshot', () => {
      expect(el.snapshot).toMatchSnapshot();
      expect(el.instance.type).toEqual('Button');
      expect(el.instance.props.onClick).toEqual(toggleFilterMenu);
      expect(el.instance.children[2].el).toContain(formatMessage(messages.editFilters));
    });
  });
});
