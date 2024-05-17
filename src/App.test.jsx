import React from 'react';
import { shallow } from '@edx/react-unit-test-utils';

import { Route } from 'react-router-dom';

import store from 'data/store';
import GradebookPage from 'containers/GradebookPage';

import App from './App';

jest.mock('react-router-dom', () => ({
  BrowserRouter: () => 'BrowserRouter',
  Route: () => 'Route',
  Routes: () => 'Routes',
}));
jest.mock('@edx/frontend-platform/react', () => ({
  AppProvider: () => 'AppProvider',
}));
jest.mock('@edx/frontend-component-footer', () => ({ FooterSlot: 'Footer' }));
jest.mock('data/store', () => 'testStore');
jest.mock('containers/GradebookPage', () => 'GradebookPage');
jest.mock('@edx/frontend-component-header', () => 'Header');
jest.mock('./head/Head', () => 'Head');

let el;
let secondChild;

describe('App router component', () => {
  test('snapshot', () => {
    expect(shallow(<App />).snapshot).toMatchSnapshot();
  });
  describe('component', () => {
    beforeEach(() => {
      el = shallow(<App />);
      secondChild = el.instance.children;
    });
    describe('AppProvider', () => {
      test('AppProvider is the parent component, passed the redux store props', () => {
        expect(el.instance.type).toBe('AppProvider');
        expect(el.instance.props.store).toEqual(store);
      });
    });
    describe('Head', () => {
      test('first child of AppProvider', () => {
        expect(el.instance.children[0].type).toBe('Head');
      });
    });
    describe('Router', () => {
      test('second child of AppProvider', () => {
        expect(secondChild[1].type).toBe('div');
      });
      test('Header is above/outside-of the routing', () => {
        expect(secondChild[1].children[0].type).toBe('Header');
        expect(secondChild[1].children[1].type).toBe('main');
      });
      test('Routing - GradebookPage is only route', () => {
        expect(secondChild[1].findByType(Route)).toHaveLength(1);
        expect(secondChild[1].findByType(Route)[0].props.path).toEqual('/:courseId');
        expect(secondChild[1].findByType(Route)[0].props.element.type).toEqual(GradebookPage);
      });
    });
  });
});
