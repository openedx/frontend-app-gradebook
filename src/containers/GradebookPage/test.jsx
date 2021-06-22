/* eslint-disable import/no-named-as-default */
import React from 'react';
import { shallow } from 'enzyme';
import queryString from 'query-string';

import selectors from 'data/selectors';
import thunkActions from 'data/thunkActions';

import { Tab, Tabs } from '@edx/paragon';

import GradebookFilters from 'components/GradebookFilters';
import GradebookHeader from 'components/GradebookHeader';
import GradesTab from 'components/GradesTab';
import BulkManagementTab from 'components/BulkManagementTab';

import { GradebookPage, mapStateToProps, mapDispatchToProps } from '.';

jest.mock('query-string', () => ({
  parse: jest.fn(val => ({ parsed: val })),
  stringify: (val) => `stringify: ${JSON.stringify(val, Object.keys(val).sort())}`,
}));

jest.mock('@edx/paragon', () => ({
  Tab: () => 'Tab',
  Tabs: () => 'Tabs',
}));
jest.mock('data/selectors', () => ({
  __esModule: true,
  default: {
    root: {
      showBulkManagement: (state) => ({ showBulkManagement: state }),
    },
  },
}));
jest.mock('data/thunkActions', () => ({
  __esModule: true,
  default: {
    app: { initialize: jest.fn() },
  },
}));

jest.mock('components/WithSidebar', () => 'WithSidebar');
jest.mock('components/GradebookHeader', () => 'GradebookHeader');
jest.mock('components/GradesTab', () => 'GradesTab');
jest.mock('components/GradebookFilters', () => 'GradebookFilters');
jest.mock('components/BulkManagementTab', () => 'BulkManagementTab');

describe('GradebookPage', () => {
  describe('component', () => {
    const courseId = 'a course';
    let el;
    const props = {
      location: {
        search: 'searchString',
      },
      match: { params: { courseId } },
    };
    beforeEach(() => {
      props.initializeApp = jest.fn();
      props.history = { push: jest.fn() };
    });
    test('snapshot - shows BulkManagementTab if showBulkManagement', () => {
      el = shallow(<GradebookPage {...props} showBulkManagement />);
      el.instance().updateQueryParams = jest.fn().mockName('updateQueryParams');
      expect(el.instance().render()).toMatchSnapshot();
    });
    test('snapshot - shows only GradesTab if showBulkManagement=false', () => {
      el = shallow(<GradebookPage {...props} />);
      el.instance().updateQueryParams = jest.fn().mockName('updateQueryParams');
      expect(el.instance().render()).toMatchSnapshot();
    });
    describe('render', () => {
      beforeEach(() => {
        el = shallow(<GradebookPage {...props} />);
      });
      describe('top-level WithSidebar', () => {
        test('sidebar from GradebookFilters, with updateQueryParams', () => {
          const { sidebar } = el.props();
          expect(sidebar).toEqual(
            <GradebookFilters updateQueryParams={el.instance().updateQueryParams} />,
          );
        });
      });
      describe('gradebook-content', () => {
        let content;
        let children;
        beforeEach(() => {
          content = el.props().children;
          children = content.props.children;
        });
        it('is wrapped in a div w/ px-3 gradebook-content classNames', () => {
          expect(content.type).toEqual('div');
          expect(content.props.className).toEqual('px-3 gradebook-content');
        });
        it('displays Gradebook header and then tabs', () => {
          expect(children[0]).toEqual(<GradebookHeader />);
        });
        it('displays tabs with only GradesTab if not showBulkManagement', () => {
          expect(shallow(children[1])).toEqual(shallow(
            <Tabs defaultActiveKey="grades">
              <Tab eventKey="grades" title="Grades">
                <GradesTab updateQueryParams={el.instance().updateQueryParams} />
              </Tab>
            </Tabs>,
          ));
        });
        it('displays tabs with grades and BulkManagement if showBulkManagement', () => {
          el = shallow(<GradebookPage {...props} showBulkManagement />);
          const tabs = el.props().children.props.children[1];
          expect(tabs).toEqual(
            <Tabs defaultActiveKey="grades">
              <Tab eventKey="grades" title="Grades">
                <GradesTab updateQueryParams={el.instance().updateQueryParams} />
              </Tab>
              <Tab eventKey="bulk_management" title="Bulk Management">
                <BulkManagementTab />
              </Tab>
            </Tabs>,
          );
        });
      });
    });
    describe('behavior', () => {
      beforeEach(() => {
        el = shallow(<GradebookPage {...props} />, { disableLifecucleMethods: true });
      });
      describe('componentDidMount', () => {
        test('initializes app with courseId and urlQuery', () => {
          el.instance().componentDidMount();
          expect(props.initializeApp).toHaveBeenCalledWith(
            courseId,
            queryString.parse(props.location.search),
          );
        });
      });
      describe('updateQueryParams', () => {
        it('replaces values for truthy values', () => {
          queryString.parse.mockImplementation(key => ({ [key]: key }));
          const newKey = 'testKey';
          const val1 = 'VALUE';
          const val2 = 'VALTWO!!';
          const args = { [newKey]: val1, [props.location.search]: val2 };
          el.instance().updateQueryParams(args);
          expect(props.history.push).toHaveBeenCalledWith(`?${queryString.stringify(args)}`);
        });
        it('clears values for non-truthy values', () => {
          queryString.parse.mockImplementation(key => ({ [key]: key }));
          const newKey = 'testKey';
          const val1 = 'VALUE';
          const val2 = false;
          const args = { [newKey]: val1, [props.location.search]: val2 };
          el.instance().updateQueryParams(args);
          expect(props.history.push).toHaveBeenCalledWith(
            `?${queryString.stringify({ [newKey]: val1 })}`,
          );
        });
      });
    });
  });
  describe('mapStateToProps', () => {
    let mapped;
    const testState = { trash: 'in', the: 'wind' };
    beforeEach(() => {
      mapped = mapStateToProps(testState);
    });
    test('showBulkManagement from root.showBulkManagement', () => {
      expect(mapped.showBulkManagement).toEqual(selectors.root.showBulkManagement(testState));
    });
  });
  describe('mapDispatchToProps', () => {
    test('initializeApp from thunkActions.app.initialize', () => {
      expect(mapDispatchToProps.initializeApp).toEqual(thunkActions.app.initialize);
    });
  });
});
