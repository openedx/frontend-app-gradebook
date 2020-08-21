import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';
import { createLogger } from 'redux-logger';
import { createMiddleware } from 'redux-beacon';
import Segment, { trackEvent, trackPageView } from '@redux-beacon/segment';
import { GOT_ROLES } from './constants/actionTypes/roles';
import {
  GOT_GRADES, GRADE_UPDATE_SUCCESS, GRADE_UPDATE_FAILURE, UPLOAD_OVERRIDE,
  UPLOAD_OVERRIDE_ERROR, BULK_GRADE_REPORT_DOWNLOADED, INTERVENTION_REPORT_DOWNLOADED,
} from './constants/actionTypes/grades';
import { UPDATE_COURSE_GRADE_LIMITS } from './constants/actionTypes/filters';

import reducers from './reducers';

const loggerMiddleware = createLogger();
const trackingCategory = 'gradebook';

const eventsMap = {
  [GOT_ROLES]: trackPageView(action => ({
    category: trackingCategory,
    page: action.courseId,
  })),
  [GOT_GRADES]: trackEvent(action => ({
    name: 'edx.gradebook.grades.displayed',
    properties: {
      category: trackingCategory,
      label: action.courseId,
      track: action.track,
      cohort: action.cohort,
      assignmentType: action.assignmentType,
      prev: action.prev,
      next: action.next,
    },
  })),
  [GRADE_UPDATE_SUCCESS]: trackEvent(action => ({
    name: 'edx.gradebook.grades.grade_override.succeeded',
    properties: {
      category: trackingCategory,
      label: action.courseId,
      updatedGrades: action.payload.responseData,
    },
  })),
  [GRADE_UPDATE_FAILURE]: trackEvent(action => ({
    name: 'edx.gradebook.grades.grade_override.failed',
    properties: {
      category: trackingCategory,
      label: action.courseId,
      error: action.payload.error,
    },
  })),
  [UPLOAD_OVERRIDE]: trackEvent(action => ({
    name: 'edx.gradebook.grades.upload.grades_overrides.succeeded',
    properties: {
      category: trackingCategory,
      label: action.courseId,
    },
  })),
  [UPLOAD_OVERRIDE_ERROR]: trackEvent(action => ({
    name: 'edx.gradebook.grades.upload.grades_overrides.failed',
    properties: {
      category: trackingCategory,
      label: action.courseId,
      error: action.payload.error,
    },
  })),
  [UPDATE_COURSE_GRADE_LIMITS]: trackEvent(action => ({
    name: 'edx.gradebook.grades.filter_applied',
    label: action.courseId,
    properties: {
      category: trackingCategory,
      label: action.courseId,
    },
  })),
  [BULK_GRADE_REPORT_DOWNLOADED]: trackEvent(action => ({
    name: 'edx.gradebook.reports.grade_export.downloaded',
    properties: {
      category: trackingCategory,
      label: action.courseId,
    },
  })),
  [INTERVENTION_REPORT_DOWNLOADED]: trackEvent(action => ({
    name: 'edx.gradebook.reports.intervention.downloaded',
    properties: {
      category: trackingCategory,
      label: action.courseId,
    },
  })),
};

const segmentMiddleware = createMiddleware(eventsMap, Segment());

const store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(thunkMiddleware, loggerMiddleware, segmentMiddleware)),
);

export { trackingCategory };
export default store;
