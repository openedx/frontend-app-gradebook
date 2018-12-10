import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { fetchUserProfile } from '@edx/frontend-auth';

import apiClient from './data/apiClient';
import Footer from './components/Gradebook/footer';
import GradebookPage from './containers/GradebookPage';
import Header from './containers/Header';
import store from './data/store';
import './App.scss';

class App extends React.Component {
  componentDidMount() {
    const username = store.getState().authentication.username;
    store.dispatch(fetchUserProfile(apiClient, username));
  }

  render() {
    return <Provider store={store}>
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
    </Provider>;
  }
}

if (apiClient.ensurePublicOrAuthencationAndCookies(window.location.pathname)) {
  ReactDOM.render(<App />, document.getElementById('root'));
}
