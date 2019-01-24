import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';
import { createLogger } from 'redux-logger';
import { createMiddleware } from 'redux-beacon';
import Segment, { trackEvent, trackPageView } from '@redux-beacon/segment';
import { GOT_ROLES } from './constants/actionTypes/roles';
import { GOT_GRADES, GRADE_UPDATE_SUCCESS, GRADE_UPDATE_FAILURE } from './constants/actionTypes/grades';

import reducers from './reducers';

const loggerMiddleware = createLogger();
const trackingCategory = 'gradebook';

const eventsMap = {
  [GOT_ROLES]: trackPageView(action => ({
    category: trackingCategory,
    page: action.courseId,
  })),
  [GOT_GRADES]: trackEvent(action => ({
    name: 'Grades displayed or paginated',
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
    name: 'Grades Updated',
    properties: {
      category: trackingCategory,
      courseId: action.courseId,
      updatedGrades: action.payload.responseData,
    },
  })),
  [GRADE_UPDATE_FAILURE]: trackEvent(action => ({
    name: 'Grades Fail to Update',
    properties: {
      category: trackingCategory,
      courseId: action.courseId,
      error: action.payload.error,
    },
  })),
};

const segmentMiddleware = createMiddleware(eventsMap, Segment());


const store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(thunkMiddleware, loggerMiddleware, segmentMiddleware)),
);

export default store;
