import { trackPageView } from '@redux-beacon/segment';

import { StrictDict } from 'utils';
import { handleEvent } from './utils';

import {
  courseId,
  events,
  eventNames,
  trackingCategory,
  triggers,
} from './constants';

const eventsMap = {};
const loadTrigger = (event, options = {}) => {
  eventsMap[triggers[event]] = handleEvent(eventNames[event], options);
};

eventsMap[triggers[events.receivedRoles]] = trackPageView(() => ({
  category: trackingCategory,
  page: courseId,
}));
loadTrigger(events.receivedGrades, {
  propsFn: (payload) => ({
    assignmentType: payload.assignmentType,
    cohort: payload.cohort,
    prev: payload.prev,
    next: payload.next,
    track: payload.track,
  }),
});
loadTrigger(events.updateSucceeded, {
  propsFn: ({ responseData }) => ({ updatedGrades: responseData }),
});
loadTrigger(events.updateFailed, {
  propsFn: ({ error }) => ({ error }),
});
loadTrigger(events.uploadOverrideSucceeded);
loadTrigger(events.uploadOverrideFailed, {
  propsFn: ({ error }) => ({ error }),
});
loadTrigger(events.filterApplied, {
  extrasFn: () => ({ label: courseId }),
});
loadTrigger(events.gradesReportDownloaded);
loadTrigger(events.interventionReportDownloaded);

export default StrictDict(eventsMap);
