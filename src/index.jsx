import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';

import apiClient from './data/apiClient';
import GradebookPage from './containers/GradebookPage';
import store from './data/store';
import './App.scss';

const App = () => (
  <Provider store={store}>
    <Router>
      <main>
        <Switch>
          <Route exact path="/:courseId" component={GradebookPage} />
        </Switch>
      </main>
    </Router>
  </Provider>
);

if (apiClient.ensurePublicOrAuthencationAndCookies(window.location.pathname)) {
  ReactDOM.render(<App />, document.getElementById('root'));
}
