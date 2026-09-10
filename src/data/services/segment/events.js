import { sendTrackEvent } from '@openedx/frontend-base';

import {
  courseId, events, eventNames, trackingCategory,
} from './constants';

/**
 * Segment analytics, emitted directly via `@openedx/frontend-base`
 * (`sendTrackEvent`) instead of the legacy `redux-beacon` middleware that mapped
 * Redux actions to Segment events. Event names + base properties (category + the
 * `courseId` label) mirror the old `redux-beacon` mapping exactly.
 */
const baseProperties = () => ({ category: trackingCategory, label: courseId });

/** Grade override saved from the edit modal succeeded. */
export const trackGradeOverrideSucceeded = (updatedGrades) => sendTrackEvent(
  eventNames[events.updateSucceeded],
  { ...baseProperties(), updatedGrades },
);

/** Grade override save failed. */
export const trackGradeOverrideFailed = (error) => sendTrackEvent(
  eventNames[events.updateFailed],
  { ...baseProperties(), error },
);

/** Bulk grade CSV override upload succeeded. */
export const trackUploadOverrideSucceeded = () => sendTrackEvent(
  eventNames[events.uploadOverrideSucceeded],
  baseProperties(),
);

/** Bulk grade CSV override upload failed. */
export const trackUploadOverrideFailed = (error) => sendTrackEvent(
  eventNames[events.uploadOverrideFailed],
  { ...baseProperties(), error },
);

/**
 * A filter was applied. Mirrors the legacy mapping, which fired this only from the
 * course-grade-limit apply action.
 */
export const trackFilterApplied = () => sendTrackEvent(
  eventNames[events.filterApplied],
  baseProperties(),
);

/** Grades CSV export was downloaded. */
export const trackGradesReportDownloaded = () => sendTrackEvent(
  eventNames[events.gradesReportDownloaded],
  baseProperties(),
);

/** Intervention report was downloaded. */
export const trackInterventionReportDownloaded = () => sendTrackEvent(
  eventNames[events.interventionReportDownloaded],
  baseProperties(),
);
