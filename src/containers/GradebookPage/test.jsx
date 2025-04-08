/* eslint-disable import/no-named-as-default */
import React from 'react';
import { render } from '@testing-library/react'; // eslint-disable-line import/no-extraneous-dependencies
import { shallow } from '@edx/react-unit-test-utils';
import queryString from 'query-string';

import selectors from '@src/data/selectors';
import thunkActions from '@src/data/thunkActions';

import GradebookFilters from '@src/components/GradebookFilters';
import GradebookHeader from '@src/components/GradebookHeader';
import GradesView from '@src/components/GradesView';
import BulkManagementHistoryView from '@src/components/BulkManagementHistoryView';
import { views } from '@src/data/constants/app';

import { GradebookPage, mapStateToProps, mapDispatchToProps } from '.';

jest.mock('query-string', () => ({
  parse: jest.fn(val => ({ parsed: val })),
  stringify: (val) => `stringify: ${JSON.stringify(val, Object.keys(val).sort())}`,
}));

jest.mock('@openedx/paragon', () => ({
  Tab: () => 'Tab',
  Tabs: () => 'Tabs',
}));
jest.mock('data/selectors', () => ({
  __esModule: true,
  default: {
    app: {
      activeView: (state) => ({ activeView: state }),
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
jest.mock('components/GradesView', () => 'GradesView');
jest.mock('components/GradebookFilters', () => 'GradebookFilters');
jest.mock('components/BulkManagementHistoryView', () => 'BulkManagementHistoryView');

describe('GradebookPage', () => {
  describe('component', () => {
    const courseId = 'a course';
    let el;
    const props = {
      location: {
        pathname: '/',
        search: 'searchString',
      },
      courseId,
      activeView: views.grades,
    };
    beforeEach(() => {
      props.initializeApp = jest.fn();
      props.navigate = jest.fn();
    });
    test('snapshot - shows BulkManagementHistoryView if activeView === views.bulkManagementHistory', () => {
      el = shallow(<GradebookPage {...props} activeView={views.bulkManagementHistory} />);
      expect(el.snapshot).toMatchSnapshot();
    });
    test('snapshot - shows GradesView if aciveView === views.grades', () => {
      el = shallow(<GradebookPage {...props} />);
      expect(el.snapshot).toMatchSnapshot();
    });
    describe('render', () => {
      beforeEach(() => {
        el = shallow(<GradebookPage {...props} />);
      });
      describe('top-level WithSidebar', () => {
        test('sidebar from GradebookFilters, with updateQueryParams', () => {
          const { sidebar } = el.instance.props;
          expect(sidebar).toMatchObject(
            <GradebookFilters updateQueryParams={el.shallowWrapper.props.sidebar.props.updateQueryParams} />,
          );
        });
      });
      describe('gradebook-content', () => {
        let content;
        let children;
        beforeEach(() => {
          content = el.instance.children;
          children = content[0].children;
        });
        it('is wrapped in a div w/ px-3 gradebook-content classNames', () => {
          expect(content[0].type).toEqual('div');
          expect(content[0].props.className).toEqual('px-3 gradebook-content');
        });
        it('displays Gradebook header and then tabs', () => {
          expect(shallow(children[0])).toEqual(shallow(<GradebookHeader />));
        });
        it('displays GradesView if activeView === views.grades', () => {
          expect(shallow(children[1])).toEqual(shallow((
            <GradesView updateQueryParams={el.shallowWrapper.props.sidebar.props.updateQueryParams} />
          )));
        });
        it('displays Bulk Management History View if activeView === views.bulkManagementHistory', () => {
          el = shallow(<GradebookPage {...props} activeView={views.bulkManagementHistory} />);
          const mainView = el.instance.children[0].children[1];
          expect(shallow(mainView)).toEqual(shallow(
            <BulkManagementHistoryView />,
          ));
        });
      });
    });
    describe('behavior', () => {
      beforeEach(() => {
        el = shallow(<GradebookPage {...props} />);
      });
      describe('componentDidMount', () => {
        test('initializes app with courseId and urlQuery', () => {
          render(<GradebookPage {...props} />);
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
          el.shallowWrapper.props.sidebar.props.updateQueryParams(args);
          expect(props.navigate).toHaveBeenCalledWith({ pathname: '/', search: `?${queryString.stringify(args)}` });
        });
        it('clears values for non-truthy values', () => {
          queryString.parse.mockImplementation(key => ({ [key]: key }));
          const newKey = 'testKey';
          const val1 = 'VALUE';
          const val2 = false;
          const args = { [newKey]: val1, [props.location.search]: val2 };
          el.shallowWrapper.props.sidebar.props.updateQueryParams(args);
          expect(props.navigate).toHaveBeenCalledWith(
            { pathname: '/', search: `?${queryString.stringify({ [newKey]: val1 })}` },
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
    test('activeView from app.activeView', () => {
      expect(mapped.activeView).toEqual(selectors.app.activeView(testState));
    });
  });
  describe('mapDispatchToProps', () => {
    test('initializeApp from thunkActions.app.initialize', () => {
      expect(mapDispatchToProps.initializeApp).toEqual(thunkActions.app.initialize);
    });
  });
});
