import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';

import Footer from '@edx/frontend-component-footer';

import { routePath } from 'data/constants/app';
import store from 'data/store';
import GradebookPage from 'containers/GradebookPage';
import EdxHeader from 'components/EdxHeader';
import './App.scss';

const App = () => (
  <IntlProvider locale="en">
    <Provider store={store}>
      <Router>
        <div>
          <EdxHeader />
          <main>
            <Switch>
              <Route
                exact
                path={routePath}
                component={GradebookPage}
              />
            </Switch>
          </main>
          <Footer logo={process.env.LOGO_POWERED_BY_OPEN_EDX_URL_SVG} />
        </div>
      </Router>
    </Provider>
  </IntlProvider>
);

export default App;
