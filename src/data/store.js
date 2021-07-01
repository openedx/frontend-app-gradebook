import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';
import { createLogger } from 'redux-logger';
import { createMiddleware } from 'redux-beacon';
import Segment from '@redux-beacon/segment';

import actions from './actions';
import selectors from './selectors';
import reducers from './reducers';
import eventsMap from './services/segment/mapping';
import { configuration } from '../config';

const loggerMiddleware = createLogger();

const middleware = [thunkMiddleware, loggerMiddleware];
// Conditionally add the segmentMiddleware only if the SEGMENT_KEY environment variable exists.
if (configuration.SEGMENT_KEY) {
  middleware.push(createMiddleware(eventsMap, Segment()));
}

const store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(...middleware)),
);

/**
 * Dev tools for redux work
 */
if (process.env.NODE_ENV === 'development') {
  window.store = store;
  window.actions = actions;
  window.selectors = selectors;
}

export default store;
