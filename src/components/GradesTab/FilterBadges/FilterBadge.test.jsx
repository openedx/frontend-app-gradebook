import React from 'react';
import { shallow } from 'enzyme';
import { FormattedMessage } from '@edx/frontend-platform/i18n';

import { Button } from '@edx/paragon';
import selectors from 'data/selectors';
import { FilterBadge, mapStateToProps } from './FilterBadge';

jest.mock('@edx/paragon', () => ({
  Button: () => 'Button',
}));
jest.mock('data/selectors', () => ({
  __esModule: true,
  default: {
    root: {
      filterBadgeConfig: jest.fn(state => ({ filterBadgeConfig: state })),
    },
  },
}));

describe('FilterBadge', () => {
  describe('component', () => {
    const config = {
      displayName: {
        defaultMessage: 'a common name',
      },
      isDefault: false,
      hideValue: false,
      value: 'a common value',
      connectedFilters: ['some', 'filters'],
    };
    const filterName = 'api.filter.name';
    let handleClose;
    let el;
    let props;
    beforeEach(() => {
      handleClose = (filters) => ({ handleClose: filters });
      props = { filterName, handleClose, config };
    });
    describe('with default value', () => {
      beforeEach(() => {
        el = shallow(
          <FilterBadge {...props} config={{ ...config, isDefault: true }} />,
        );
      });
      test('snapshot - empty', () => {
        expect(el).toMatchSnapshot();
      });
      it('does not display', () => {
        expect(el).toEqual({});
      });
    });
    describe('with non-default value (active)', () => {
      describe('if hideValue is true', () => {
        beforeEach(() => {
          el = shallow(
            <FilterBadge {...props} config={{ ...config, hideValue: true }} />,
          );
        });
        test('snapshot - shows displayName but not value in span', () => {
          expect(el).toMatchSnapshot();
        });
        it('shows displayName but not value in span', () => {
          expect(el.find('span.badge').childAt(0).getElement()).toEqual(
            <span>
              <FormattedMessage {...config.displayName} />
            </span>,
          );
        });
        it('calls a handleClose event for connected filters on button click', () => {
          expect(el.find(Button).props().onClick).toEqual(handleClose(config.connectedFilters));
        });
      });
      describe('if hideValue is false (default)', () => {
        beforeEach(() => {
          el = shallow(<FilterBadge {...props} />);
        });
        test('snapshot', () => {
          expect(el).toMatchSnapshot();
        });
        it('shows displayName and value in span', () => {
          expect(el.find('span.badge').childAt(0).getElement()).toEqual(
            <span>
              <FormattedMessage {...config.displayName} />
            </span>,
          );
          expect(el.find('span.badge').childAt(1).getElement()).toEqual(
            <span>
              {`: ${config.value}`}
            </span>,
          );
        });
        it('calls a handleClose event for connected filters on button click', () => {
          expect(el.find(Button).props().onClick).toEqual(handleClose(config.connectedFilters));
        });
      });
    });
  });
  describe('mapStateToProps', () => {
    const testState = { some: 'kind', of: 'alien' };
    const filterName = 'Lilu Dallas Multipass';
    test('config loads config from root.filterBadgeConfig with ownProps.filterName', () => {
      const { config } = mapStateToProps(testState, { filterName });
      expect(config).toEqual(selectors.root.filterBadgeConfig(testState, filterName));
    });
  });
});
