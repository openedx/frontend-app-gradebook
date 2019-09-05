import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';
import { createLogger } from 'redux-logger';
import { createMiddleware } from 'redux-beacon';
import Segment, { trackEvent, trackPageView } from '@redux-beacon/segment';
import { GOT_ROLES } from './constants/actionTypes/roles';
import {
  GOT_GRADES, GRADE_UPDATE_SUCCESS, GRADE_UPDATE_FAILURE,
  UPLOAD_OVERRIDE, UPLOAD_OVERRIDE_ERROR,
} from './constants/actionTypes/grades';

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
      courseId: action.courseId,
      track: action.track,
      cohort: action.cohort,
      assignmentType: action.assignmentType,
      prev: action.prev,
      next: action.next,
    },
  })),
  [GRADE_UPDATE_SUCCESS]: trackEvent(action => ({
    name: 'edx.gradebook.grades.grade_override.success',
    properties: {
      category: trackingCategory,
      courseId: action.courseId,
      updatedGrades: action.payload.responseData,
    },
  })),
  [GRADE_UPDATE_FAILURE]: trackEvent(action => ({
    name: 'edx.gradebook.grades.grade_override.failure',
    properties: {
      category: trackingCategory,
      courseId: action.courseId,
      error: action.payload.error,
    },
  })),
  [UPLOAD_OVERRIDE]: trackEvent(action => ({
    name: 'edx.gradebook.grades.upload.grades_overrides',
    properties: {
      category: trackingCategory,
      courseId: action.courseId,
      reportType: action.reportType,
    },
  })),
  [UPLOAD_OVERRIDE_ERROR]: trackEvent(action => ({
    name: 'edx.gradebook.grades.upload.error',
    properties: {
      category: trackingCategory,
      courseId: action.courseId,
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
