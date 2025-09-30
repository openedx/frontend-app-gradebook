import React from 'react';
import { Outlet } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { CurrentAppProvider } from '@openedx/frontend-base';
import { appId } from './constants';

import store from './data/store';
import './app.scss';

const App = () => (
  <CurrentAppProvider appId={appId}>
    <ReduxProvider store={store}>
      <Outlet></Outlet>
    </ReduxProvider>
  </CurrentAppProvider>
);

export default App;
