import React from 'react';
import { shallow } from 'enzyme';

import { Route, Routes } from 'react-router-dom';
import { AppProvider } from '@edx/frontend-platform/react';

import Footer from '@edx/frontend-component-footer';
import Header from '@edx/frontend-component-header';

import store from 'data/store';
import GradebookPage from 'containers/GradebookPage';

import App from './App';
import Head from './head/Head';

jest.mock('react-router-dom', () => ({
  BrowserRouter: () => 'BrowserRouter',
  Route: () => 'Route',
}));
jest.mock('@edx/frontend-platform/react', () => ({
  AppProvider: () => 'AppProvider',
}));
jest.mock('@edx/frontend-component-footer', () => 'Footer');
jest.mock('data/store', () => 'testStore');
jest.mock('containers/GradebookPage', () => 'GradebookPage');
jest.mock('@edx/frontend-component-header', () => 'Header');

const logo = 'fakeLogo.png';
let el;
let secondChild;

describe('App router component', () => {
  test('snapshot', () => {
    expect(shallow(<App />)).toMatchSnapshot();
  });
  describe('component', () => {
    beforeEach(() => {
      process.env.LOGO_POWERED_BY_OPEN_EDX_URL_SVG = logo;
      el = shallow(<App />);
      secondChild = el.childAt(1);
    });
    describe('AppProvider', () => {
      test('AppProvider is the parent component, passed the redux store props', () => {
        expect(el.type()).toBe(AppProvider);
        expect(el.props().store).toEqual(store);
      });
    });
    describe('Head', () => {
      test('first child of AppProvider', () => {
        expect(el.childAt(0).type()).toBe(Head);
      });
    });
    describe('Router', () => {
      test('second child of AppProvider', () => {
        expect(secondChild.type()).toBe('div');
      });
      test('Header is above/outside-of the routing', () => {
        expect(secondChild.childAt(0).type()).toBe(Header);
        expect(secondChild.childAt(1).type()).toBe('main');
      });
      test('Routing - GradebookPage is only route', () => {
        expect(secondChild.find('main')).toEqual(shallow(
          <main>
            <Routes>
              <Route path="/:courseId" element={<GradebookPage />} />
            </Routes>
          </main>,
        ));
      });
    });
    test('Footer logo drawn from env variable', () => {
      expect(secondChild.find(Footer).props().logo).toEqual(logo);
    });
  });
});
