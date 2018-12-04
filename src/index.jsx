import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Icon } from '@edx/paragon';

import apiClient from './data/apiClient';
import Footer from './components/Gradebook/footer';
import GradebookPage from './containers/GradebookPage';
import Header from './components/Header';
import store from './data/store';
import './App.scss';


const App = () => (
  <Provider store={store}>
    <Router>
      <div>
        <Header />
        <main>
          <Switch>
            <Route exact path="/:courseId" component={GradebookPage} />
          </Switch>
        </main>
        <Footer />
      </div>
    </Router>
  </Provider>
);

if (apiClient.ensurePublicOrAuthencationAndCookies(window.location.pathname)) {
  ReactDOM.render(<App />, document.getElementById('root'));
}
