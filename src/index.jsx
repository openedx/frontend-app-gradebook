import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import { Provider } from 'react-redux';

import GradebookPage from './containers/GradebookPage';
import store from './data/store';
import './App.scss';

const App = () => (
  <Provider store={store}>
    <Router>
      <div>
        <header>
          <nav>
            <ul className="nav">
              <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
            </ul>
          </nav>
        </header>
        <main>
          <Switch>
            <Route exact path="/" component={GradebookPage} />
          </Switch>
        </main>
      </div>
    </Router>
  </Provider>
);

ReactDOM.render(<App />, document.getElementById('root'));
