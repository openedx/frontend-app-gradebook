import React from 'react';
import { shallow } from 'enzyme';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AppProvider } from '@edx/frontend-platform/react';

import Footer from '@edx/frontend-component-footer';
import Header from '@edx/frontend-component-header';

import { routePath } from 'data/constants/app';
import store from 'data/store';
import GradebookPage from 'containers/GradebookPage';

import App from './App';

jest.mock('react-router-dom', () => ({
  BrowserRouter: () => 'BrowserRouter',
  Route: () => 'Route',
  Switch: () => 'Switch',
}));
jest.mock('@edx/frontend-platform/react', () => ({
  AppProvider: () => 'AppProvider',
}));
jest.mock('data/constants/app', () => ({
  routePath: '/:courseId',
}));
jest.mock('@edx/frontend-component-footer', () => 'Footer');
jest.mock('data/store', () => 'testStore');
jest.mock('containers/GradebookPage', () => 'GradebookPage');
jest.mock('@edx/frontend-component-header', () => 'Header');

const logo = 'fakeLogo.png';
let el;
let router;

describe('App router component', () => {
  test('snapshot', () => {
    expect(shallow(<App />)).toMatchSnapshot();
  });
  describe('component', () => {
    beforeEach(() => {
      process.env.LOGO_POWERED_BY_OPEN_EDX_URL_SVG = logo;
      el = shallow(<App />);
      router = el.childAt(0);
    });
    describe('AppProvider', () => {
      test('AppProvider is the parent component, passed the redux store props', () => {
        expect(el.type()).toBe(AppProvider);
        expect(el.props().store).toEqual(store);
      });
    });
    describe('Router', () => {
      test('first child of AppProvider', () => {
        expect(router.type()).toBe(Router);
      });
      test('Header is above/outside-of the routing', () => {
        expect(router.childAt(0).childAt(0).type()).toBe(Header);
        expect(router.childAt(0).childAt(1).type()).toBe('main');
      });
      test('Routing - GradebookPage is only route', () => {
        expect(router.find('main')).toEqual(shallow(
          <main>
            <Switch>
              <Route exact path={routePath} component={GradebookPage} />
            </Switch>
          </main>,
        ));
      });
    });
    test('Footer logo drawn from env variable', () => {
      expect(router.find(Footer).props().logo).toEqual(logo);
    });
  });
});
