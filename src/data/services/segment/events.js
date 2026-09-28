import { sendTrackEvent } from '@openedx/frontend-base';

import {
  events, eventNames, trackingCategory,
} from './constants';

/**
 * Segment analytics, emitted directly via `@openedx/frontend-base`
 * (`sendTrackEvent`) instead of the legacy `redux-beacon` middleware that mapped
 * Redux actions to Segment events. Event names + base properties (category + the
 * `courseId` label) mirror the old `redux-beacon` mapping exactly.
 */
const baseProperties = (courseId) => ({ category: trackingCategory, label: courseId });

/**
 * Grades were fetched and displayed. Mirrors the legacy `receivedGrades` trigger,
 * which fired per fetch with the filters it ran under and the page cursors.
 */
export const trackGradesDisplayed = (courseId, {
  assignmentType, cohort, track, prev, next,
}) => sendTrackEvent(
  eventNames[events.receivedGrades],
  {
    ...baseProperties(courseId), assignmentType, cohort, track, prev, next,
  },
);

/** Grade override saved from the edit modal succeeded. */
export const trackGradeOverrideSucceeded = (courseId, updatedGrades) => sendTrackEvent(
  eventNames[events.updateSucceeded],
  { ...baseProperties(courseId), updatedGrades },
);

/** Grade override save failed. */
export const trackGradeOverrideFailed = (courseId, error) => sendTrackEvent(
  eventNames[events.updateFailed],
  { ...baseProperties(courseId), error },
);

/** Bulk grade CSV override upload succeeded. */
export const trackUploadOverrideSucceeded = (courseId) => sendTrackEvent(
  eventNames[events.uploadOverrideSucceeded],
  baseProperties(courseId),
);

/** Bulk grade CSV override upload failed. */
export const trackUploadOverrideFailed = (courseId, error) => sendTrackEvent(
  eventNames[events.uploadOverrideFailed],
  { ...baseProperties(courseId), error },
);

/**
 * A filter was applied. Mirrors the legacy mapping, which fired this only from the
 * course-grade-limit apply action.
 */
export const trackFilterApplied = (courseId) => sendTrackEvent(
  eventNames[events.filterApplied],
  baseProperties(courseId),
);

/** Grades CSV export was downloaded. */
export const trackGradesReportDownloaded = (courseId) => sendTrackEvent(
  eventNames[events.gradesReportDownloaded],
  baseProperties(courseId),
);

/** Intervention report was downloaded. */
export const trackInterventionReportDownloaded = (courseId) => sendTrackEvent(
  eventNames[events.interventionReportDownloaded],
  baseProperties(courseId),
);
