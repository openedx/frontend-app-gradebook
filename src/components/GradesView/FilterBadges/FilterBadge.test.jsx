import React from 'react';
import { shallow } from 'enzyme';
import { useIntl } from '@edx/frontend-platform/i18n';

import { formatMessage } from 'testUtils';
import { Button } from '@edx/paragon';
import { selectors } from 'data/redux/hooks';
import FilterBadge from './FilterBadge';

jest.mock('@edx/paragon', () => ({
  Button: () => 'Button',
}));
jest.mock('data/redux/hooks', () => ({
  selectors: {
    root: {
      useFilterBadgeConfig: jest.fn(),
    },
  },
}));

const handleClose = jest.fn(filters => ({ handleClose: filters }));
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

let el;
describe('FilterBadge', () => {
  beforeEach(() => {
    el = shallow(<FilterBadge {...{ handleClose, filterName }} />);
  });
  describe('behavior', () => {
    it('initializes intl hook', () => {
      expect(useIntl).toHaveBeenCalled();
    });
    it('initializes redux hooks', () => {
      expect(selectors.root.useFilterBadgeConfig).toHaveBeenCalledWith(filterName);
    });
  });
  describe('render', () => {
    const testDisplayName = () => {
      test('formatted display name appears on badge', () => {
        expect(el.contains(formatMessage(hookProps.displayName))).toEqual(true);
      });
    };
    const testCloseButton = () => {
      test('close button forwards close method', () => {
        expect(el.find(Button).props().onClick).toEqual(handleClose(hookProps.connectedFilters));
      });
    };
    test('empty render if isDefault', () => {
      selectors.root.useFilterBadgeConfig.mockReturnValueOnce({
        ...hookProps,
        isDefault: true,
      });
      el = shallow(<FilterBadge {...{ handleClose, filterName }} />);
      expect(el.isEmptyRender()).toEqual(true);
    });
    describe('hide Value', () => {
      beforeEach(() => {
        selectors.root.useFilterBadgeConfig.mockReturnValueOnce({
          ...hookProps,
          hideValue: true,
        });
        el = shallow(<FilterBadge {...{ handleClose, filterName }} />);
      });
      testDisplayName();
      testCloseButton();
      test('snapshot', () => {
        expect(el).toMatchSnapshot();
      });
      test('value is note present in the badge', () => {
        expect(el.contains(hookProps.value)).toEqual(false);
      });
    });
    describe('do not hide value', () => {
      testDisplayName();
      testCloseButton();
      test('snapshot', () => {
        expect(el).toMatchSnapshot();
      });
      test('value is note present in the badge', () => {
        expect(el.text().includes(hookProps.value)).toEqual(true);
      });
    });
  });
});
