import React from 'react';
import { shallow } from 'enzyme';

import thunkActions from 'data/thunkActions';

import { FilterMenuToggle, mapDispatchToProps, mapStateToProps } from './FilterMenuToggle';

jest.mock('@edx/paragon', () => ({
  Button: () => 'Button',
  Icon: () => 'Icon',
}));
jest.mock('data/thunkActions', () => ({
  __esModule: true,
  default: {
    app: {
      filterMenu: { toggle: jest.fn() },
    },
  },
}));

describe('FilterMenuToggle component', () => {
  describe('snapshots', () => {
    test('basic snapshot', () => {
      const toggleFilterDrawer = jest.fn().mockName('this.props.toggleFilterDrawer');
      expect(shallow((
        <FilterMenuToggle {...{ toggleFilterDrawer }} />
      ))).toMatchSnapshot();
    });
  });
  describe('mapStateToProps', () => {
    test('does not connect any selectors', () => {
      expect(mapStateToProps({ test: 'state' })).toEqual({});
    });
  });
  describe('mapDispatchToProps', () => {
    test('toggleFilterDrawer from thunkActions.app.filterMenu.toggle', () => {
      expect(mapDispatchToProps.toggleFilterDrawer).toEqual(
        thunkActions.app.filterMenu.toggle,
      );
    });
  });
});
