import { sendTrackEvent } from '@openedx/frontend-base';

import { eventNames, events, trackingCategory } from './constants';
import {
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
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const expectBase = (call: unknown[]) => {
    const props = call[1] as { category: string; label: string };
    expect(props.category).toBe(trackingCategory);
    expect(typeof props.label).toBe('string');
  };

  it('trackGradeOverrideSucceeded includes the updated grades payload', () => {
    trackGradeOverrideSucceeded({ id: 1 });
    expect(sendTrackEventMock).toHaveBeenCalledWith(
      eventNames[events.updateSucceeded],
      expect.objectContaining({ updatedGrades: { id: 1 } }),
    );
    expectBase(sendTrackEventMock.mock.calls[0]);
  });

  it('trackGradeOverrideFailed includes the error payload', () => {
    const error = new Error('boom');
    trackGradeOverrideFailed(error);
    expect(sendTrackEventMock).toHaveBeenCalledWith(
      eventNames[events.updateFailed],
      expect.objectContaining({ error }),
    );
  });

  it('trackUploadOverrideSucceeded fires without extra props', () => {
    trackUploadOverrideSucceeded();
    expect(sendTrackEventMock).toHaveBeenCalledWith(
      eventNames[events.uploadOverrideSucceeded],
      expect.objectContaining({ category: trackingCategory }),
    );
  });

  it('trackUploadOverrideFailed includes the error payload', () => {
    trackUploadOverrideFailed({ status: 500 });
    expect(sendTrackEventMock).toHaveBeenCalledWith(
      eventNames[events.uploadOverrideFailed],
      expect.objectContaining({ error: { status: 500 } }),
    );
  });

  it.each([
    ['trackFilterApplied', trackFilterApplied, events.filterApplied],
    ['trackGradesReportDownloaded', trackGradesReportDownloaded, events.gradesReportDownloaded],
    ['trackInterventionReportDownloaded', trackInterventionReportDownloaded, events.interventionReportDownloaded],
  ])('%s emits the mapped Segment event with base properties', (_name, fn, key) => {
    (fn as () => void)();
    expect(sendTrackEventMock).toHaveBeenCalledWith(
      eventNames[key],
      expect.objectContaining({ category: trackingCategory }),
    );
  });
});
