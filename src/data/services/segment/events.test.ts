import { sendTrackEvent } from '@openedx/frontend-base';

import { eventNames, events, trackingCategory } from './constants';
import {
  trackGradesDisplayed,
  trackGradeOverrideSucceeded,
  trackGradeOverrideFailed,
  trackUploadOverrideSucceeded,
  trackUploadOverrideFailed,
  trackFilterApplied,
  trackGradesReportDownloaded,
  trackInterventionReportDownloaded,
} from './events';

jest.mock('@openedx/frontend-base', () => ({
  ...jest.requireActual('@openedx/frontend-base'),
  sendTrackEvent: jest.fn(),
}));

const sendTrackEventMock = jest.mocked(sendTrackEvent);

describe('segment tracking events', () => {
  const courseId = 'course-v1:X';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const expectBase = (call: unknown[]) => {
    const props = call[1] as { category: string; label: string };
    expect(props.category).toBe(trackingCategory);
    expect(props.label).toBe(courseId);
  };

  it('trackGradesDisplayed includes the fetch filters and page cursors', () => {
    trackGradesDisplayed(courseId, {
      assignmentType: 'Homework', cohort: '2', track: 'audit', prev: 'p', next: 'n',
    });
    expect(sendTrackEventMock).toHaveBeenCalledWith(
      eventNames[events.receivedGrades],
      expect.objectContaining({
        assignmentType: 'Homework', cohort: '2', track: 'audit', prev: 'p', next: 'n',
      }),
    );
    expectBase(sendTrackEventMock.mock.calls[0]);
  });

  it('trackGradeOverrideSucceeded includes the updated grades payload', () => {
    trackGradeOverrideSucceeded(courseId, { id: 1 });
    expect(sendTrackEventMock).toHaveBeenCalledWith(
      eventNames[events.updateSucceeded],
      expect.objectContaining({ updatedGrades: { id: 1 } }),
    );
    expectBase(sendTrackEventMock.mock.calls[0]);
  });

  it('trackGradeOverrideFailed includes the error payload', () => {
    const error = new Error('boom');
    trackGradeOverrideFailed(courseId, error);
    expect(sendTrackEventMock).toHaveBeenCalledWith(
      eventNames[events.updateFailed],
      expect.objectContaining({ error, label: courseId }),
    );
  });

  it('trackUploadOverrideSucceeded fires without extra props', () => {
    trackUploadOverrideSucceeded(courseId);
    expect(sendTrackEventMock).toHaveBeenCalledWith(
      eventNames[events.uploadOverrideSucceeded],
      expect.objectContaining({ category: trackingCategory, label: courseId }),
    );
  });

  it('trackUploadOverrideFailed includes the error payload', () => {
    trackUploadOverrideFailed(courseId, { status: 500 });
    expect(sendTrackEventMock).toHaveBeenCalledWith(
      eventNames[events.uploadOverrideFailed],
      expect.objectContaining({ error: { status: 500 }, label: courseId }),
    );
  });

  it.each([
    ['trackFilterApplied', trackFilterApplied, events.filterApplied],
    ['trackGradesReportDownloaded', trackGradesReportDownloaded, events.gradesReportDownloaded],
    ['trackInterventionReportDownloaded', trackInterventionReportDownloaded, events.interventionReportDownloaded],
  ])('%s emits the mapped Segment event with the courseId label', (_name, fn, key) => {
    (fn as (courseId: string) => void)(courseId);
    expect(sendTrackEventMock).toHaveBeenCalledWith(
      eventNames[key],
      expect.objectContaining({ category: trackingCategory, label: courseId }),
    );
  });
});
