/* eslint-disable import/no-named-as-default */
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import {
  APP_READY,
  getConfig,
  initialize,
  subscribe,
} from '@edx/frontend-platform';
import { IntlProvider } from 'react-intl';

import Footer, { messages as footerMessages } from '@edx/frontend-component-footer';

import GradebookPage from './containers/GradebookPage';
import Header from './components/Header';
import store from './data/store';
import './App.scss';

const App = () => (
  <IntlProvider locale="en">
    <Provider store={store}>
      <Router>
        <div>
          <Header />
          <main>
            <Switch>
              <Route exact path={getConfig().PUBLIC_PATH.concat(':courseId')} component={GradebookPage} />
            </Switch>
          </main>
          <Footer logo={process.env.LOGO_POWERED_BY_OPEN_EDX_URL_SVG} />
        </div>
      </Router>
    </Provider>
  </IntlProvider>
);

subscribe(APP_READY, () => {
  ReactDOM.render(<App />, document.getElementById('root'));
});

initialize({
  messages: [
    footerMessages,
  ],
  requireAuthenticatedUser: true,
});
