import React from 'react';
import { shallow } from 'enzyme';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';

import Footer from '@edx/frontend-component-footer';

import { routePath } from 'data/constants/app';
import store from 'data/store';
import GradebookPage from 'containers/GradebookPage';
import EdxHeader from 'components/EdxHeader';

import App from './App';

jest.mock('react-router-dom', () => ({
  BrowserRouter: () => 'BrowserRouter',
  Route: () => 'Route',
  Switch: () => 'Switch',
}));
jest.mock('react-redux', () => ({
  Provider: () => 'Provider',
}));
jest.mock('react-intl', () => ({
  IntlProvider: () => 'IntlProvider',
}));
jest.mock('data/constants/app', () => ({
  routePath: '/:courseId',
}));
jest.mock('@edx/frontend-component-footer', () => 'Footer');
jest.mock('data/store', () => 'testStore');
jest.mock('containers/GradebookPage', () => 'GradebookPage');
jest.mock('components/EdxHeader', () => 'EdxHeader');

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
      router = el.childAt(0).childAt(0);
    });
    describe('IntlProvider', () => {
      test('outer-wrapper component', () => {
        expect(el.type()).toBe(IntlProvider);
      });
      test('"en" locale', () => {
        expect(el.props().locale).toEqual('en');
      });
    });
    describe('Provider, inside IntlProvider', () => {
      test('first child, passed the redux store props', () => {
        expect(el.childAt(0).type()).toBe(Provider);
        expect(el.childAt(0).props().store).toEqual(store);
      });
    });
    describe('Router', () => {
      test('first child of Provider', () => {
        expect(router.type()).toBe(Router);
      });
      test('EdxHeader is above/outside-of the routing', () => {
        expect(router.childAt(0).childAt(0).type()).toBe(EdxHeader);
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
