import React from 'react';
import { shallow } from 'enzyme';

import thunkActions from 'data/thunkActions';

import {
  GradebookFiltersHeader,
  mapDispatchToProps,
} from './GradebookFiltersHeader';

jest.mock('@edx/paragon', () => ({
  Icon: jest.fn().mockName('Paragon.Icon'),
  IconButton: () => 'IconButton',
}));

jest.mock('@edx/paragon/icons', () => ({
  close: jest.fn().mockName('Paragon.icons.Close'),
}));

jest.mock('data/thunkActions', () => ({
  __esModule: true,
  default: {
    app: {
      filterMenu: {
        close: jest.fn().mockName('closeFilterMenu'),
      },
    },
  },
}));

describe('GradebookFiltersHeader', () => {
  let props;
  beforeEach(() => {
    props = {
      closeMenu: jest.fn().mockName('props.closeMenu'),
    };
  });

  describe('Component', () => {
    describe('snapshots', () => {
      test('basic snapshot', () => {
        const el = shallow(<GradebookFiltersHeader {...props} />);
        expect(el).toMatchSnapshot();
      });
    });
  });
  describe('mapDispatchToProps', () => {
    describe('closeMenu', () => {
      test('from thunkActions.app.filterMenu.close', () => {
        expect(mapDispatchToProps.closeMenu).toEqual(
          thunkActions.app.filterMenu.close,
        );
      });
    });
  });
});
