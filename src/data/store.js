import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';
import { createLogger } from 'redux-logger';
import { createMiddleware } from 'redux-beacon';
import Segment, { trackEvent, trackPageView } from '@redux-beacon/segment';

import actions from './actions';
import reducers from './reducers';

const loggerMiddleware = createLogger();
const trackingCategory = 'gradebook';

const eventsMap = {
  [actions.roles.received.toString()]: trackPageView(({ payload }) => ({
    category: trackingCategory,
    page: payload.courseId,
  })),
  [actions.grades.received.toString()]: trackEvent(({ payload }) => ({
    name: 'edx.gradebook.grades.displayed',
    properties: {
      category: trackingCategory,
      label: payload.courseId,
      track: payload.track,
      cohort: payload.cohort,
      assignmentType: payload.assignmentType,
      prev: payload.prev,
      next: payload.next,
    },
  })),
  [actions.grades.update.success.toString()]: trackEvent(({ payload }) => ({
    name: 'edx.gradebook.grades.grade_override.succeeded',
    properties: {
      category: trackingCategory,
      label: payload.courseId,
      updatedGrades: payload.responseData,
    },
  })),
  [actions.grades.update.failure.toString()]: trackEvent(({ payload }) => ({
    name: 'edx.gradebook.grades.grade_override.failed',
    properties: {
      category: trackingCategory,
      label: payload.courseId,
      error: payload.error,
    },
  })),
  [actions.grades.uploadOverride.success.toString()]: trackEvent(({ payload }) => ({
    name: 'edx.gradebook.grades.upload.grades_overrides.succeeded',
    properties: {
      category: trackingCategory,
      label: payload.courseId,
    },
  })),
  [actions.grades.uploadOverride.failure.toString()]: trackEvent(({ payload }) => ({
    name: 'edx.gradebook.grades.upload.grades_overrides.failed',
    properties: {
      category: trackingCategory,
      label: payload.courseId,
      error: payload.error,
    },
  })),
  [actions.filters.update.courseGradeLimits]: trackEvent(({ payload }) => ({
    name: 'edx.gradebook.grades.filter_applied',
    label: payload.courseId,
    properties: {
      category: trackingCategory,
      label: payload.courseId,
    },
  })),
  [actions.grades.downloadReport.bulkGrades.toString()]: trackEvent(
    ({ payload }) => ({
      name: 'edx.gradebook.reports.grade_export.downloaded',
      properties: {
        category: trackingCategory,
        label: payload.courseId,
      },
    }),
  ),
  [actions.grades.downloadReport.intervention.toString()]: trackEvent(
    ({ payload }) => ({
      name: 'edx.gradebook.reports.intervention.downloaded',
      properties: {
        category: trackingCategory,
        label: payload.courseId,
      },
    }),
  ),
};

const segmentMiddleware = createMiddleware(eventsMap, Segment());

const store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(thunkMiddleware, loggerMiddleware, segmentMiddleware)),
);

export { trackingCategory };
export default store;
