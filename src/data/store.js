import * as redux from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';
import { createLogger } from 'redux-logger';
import { createMiddleware } from 'redux-beacon';
import Segment from '@redux-beacon/segment';
import { getConfig } from '@edx/frontend-platform';

import actions from './actions';
import selectors from './selectors';
import reducers from './reducers';
import eventsMap from './services/segment/mapping';

export const createStore = () => {
  const loggerMiddleware = createLogger();

  const middleware = [thunkMiddleware, loggerMiddleware];
  // Conditionally add the segmentMiddleware only if the SEGMENT_KEY environment variable exists.
  if (getConfig().SEGMENT_KEY) {
    middleware.push(createMiddleware(eventsMap, Segment()));
  }
  const store = redux.createStore(
    reducers,
    composeWithDevTools(redux.applyMiddleware(...middleware)),
  );

  /**
   * Dev tools for redux work
   */
  if (process.env.NODE_ENV === 'development') {
    window.store = store;
    window.actions = actions;
    window.selectors = selectors;
  }

  return store;
};

const store = createStore();

export default store;
