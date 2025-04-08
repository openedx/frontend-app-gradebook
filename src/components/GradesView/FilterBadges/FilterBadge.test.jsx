import React from 'react';
import { shallow } from '@edx/react-unit-test-utils';
import { useIntl } from '@edx/frontend-platform/i18n';

import { formatMessage } from 'testUtils';
import { Button } from '@openedx/paragon';
import { selectors } from '@src/data/redux/hooks';
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
        expect(el.instance.findByTestId('display-name')[0].children[0].el).toEqual(formatMessage(hookProps.displayName));
      });
    };
    const testCloseButton = () => {
      test('close button forwards close method', () => {
        expect(el.instance.findByType(Button)[0].props.onClick).toEqual(handleClose(hookProps.connectedFilters));
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
        expect(el.snapshot).toMatchSnapshot();
      });
      test('value is note present in the badge', () => {
        expect(el.instance.findByTestId('filter-value')[0].children).toHaveLength(0);
      });
    });
    describe('do not hide value', () => {
      testDisplayName();
      testCloseButton();
      test('snapshot', () => {
        expect(el.snapshot).toMatchSnapshot();
      });
      test('value is present in the badge', () => {
        expect(el.instance.findByTestId('filter-value')[0].children[0].el).toBe(`: ${hookProps.value}`);
      });
    });
  });
});
