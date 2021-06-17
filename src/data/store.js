import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';
import { createLogger } from 'redux-logger';
import { createMiddleware } from 'redux-beacon';
import Segment, { trackEvent, trackPageView } from '@redux-beacon/segment';

import actions from './actions';
import selectors from './selectors';
import reducers from './reducers';
import { configuration } from '../config';

const loggerMiddleware = createLogger();
const trackingCategory = 'gradebook';

const eventsMap = {
  [actions.roles.fetching.received.toString()]: trackPageView((action, prevState) => ({
    category: trackingCategory,
    page: selectors.app.courseId(prevState),
  })),
  [actions.grades.fetching.received.toString()]: trackEvent(({ payload }, prevState) => ({
    name: 'edx.gradebook.grades.displayed',
    properties: {
      category: trackingCategory,
      label: selectors.app.courseId(prevState),
      track: payload.track,
      cohort: payload.cohort,
      assignmentType: payload.assignmentType,
      prev: payload.prev,
      next: payload.next,
    },
  })),
  [actions.grades.update.success.toString()]: trackEvent(({ payload }, prevState) => ({
    name: 'edx.gradebook.grades.grade_override.succeeded',
    properties: {
      category: trackingCategory,
      label: selectors.app.courseId(prevState),
      updatedGrades: payload.responseData,
    },
  })),
  [actions.grades.update.failure.toString()]: trackEvent(({ payload }, prevState) => ({
    name: 'edx.gradebook.grades.grade_override.failed',
    properties: {
      category: trackingCategory,
      label: selectors.app.courseId(prevState),
      error: payload.error,
    },
  })),
  [actions.grades.uploadOverride.success.toString()]: trackEvent((action, prevState) => ({
    name: 'edx.gradebook.grades.upload.grades_overrides.succeeded',
    properties: {
      category: trackingCategory,
      label: selectors.app.courseId(prevState),
    },
  })),
  [actions.grades.uploadOverride.failure.toString()]: trackEvent(({ payload }, prevState) => ({
    name: 'edx.gradebook.grades.upload.grades_overrides.failed',
    properties: {
      category: trackingCategory,
      label: selectors.app.courseId(prevState),
      error: payload.error,
    },
  })),
  [actions.filters.update.courseGradeLimits]: trackEvent((action, prevState) => ({
    name: 'edx.gradebook.grades.filter_applied',
    label: selectors.app.courseId(prevState),
    properties: {
      category: trackingCategory,
      label: selectors.app.courseId(prevState),
    },
  })),
  [actions.grades.downloadReport.bulkGrades.toString()]: trackEvent(
    (action, prevState) => ({
      name: 'edx.gradebook.reports.grade_export.downloaded',
      properties: {
        category: trackingCategory,
        label: selectors.app.courseId(prevState),
      },
    }),
  ),
  [actions.grades.downloadReport.intervention.toString()]: trackEvent(
    (action, prevState) => ({
      name: 'edx.gradebook.reports.intervention.downloaded',
      properties: {
        category: trackingCategory,
        label: selectors.app.courseId(prevState),
      },
    }),
  ),
};

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

export { trackingCategory };
export default store;
