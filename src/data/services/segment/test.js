/**
 * This module houses integration tests for the segment api integration
 */
import actions from 'data/actions';
import eventsMap from './mapping';

import {
  courseId,
  events,
  eventNames,
  trackingCategory as category,
  triggers,
} from './constants';

jest.mock('./constants', () => ({
  ...jest.requireActual('./constants'),
  courseId: 'a-fake-course-id',
}));
jest.mock('@redux-beacon/segment', () => ({
  trackEvent: (event) => ({ trackEvent: event }),
  trackPageView: (event) => ({ trackPageView: event }),
}));

describe('segments event map', () => {
  const loadEvent = (event) => ({
    event,
    trigger: triggers[event],
    handler: eventsMap[triggers[event]],
  });
  describe('app initialization (received roles api response)', () => {
    const { trigger, handler } = loadEvent(events.receivedRoles);
    test('triggers on actions.roles.fetching.received', () => {
      expect(trigger).toEqual(actions.roles.fetching.received.toString());
    });
    it('tracks the page view', () => {
      expect(handler.trackPageView()).toEqual({ category, page: courseId });
    });
  });
  describe('received grades update success', () => {
    const { event, trigger, handler } = loadEvent(events.receivedGrades);
    const payload = {
      assignmentType: 'potions',
      cohort: 3,
      prev: 'aPlace',
      next: 'aNotherPlace',
      track: 'auror',
    };
    test('triggers on actions.grades.fetching.received', () => {
      expect(trigger).toEqual(actions.grades.fetching.received.toString());
    });
    it('tracks event with ({ assignmentType, cohort, prev, next, track })', () => {
      expect(handler.trackEvent({ payload })).toEqual({
        name: eventNames[event],
        properties: {
          category,
          label: courseId,
          ...payload,
        },
      });
    });
  });
  describe('grades update success', () => {
    const { event, trigger, handler } = loadEvent(events.updateSucceeded);
    const payload = { responseData: 'some new GRADES!' };
    test('triggers on actions.grades.update.success', () => {
      expect(trigger).toEqual(actions.grades.update.success.toString());
    });
    it('tracks event with ({ updatedGrades: payload.responseData })', () => {
      expect(handler.trackEvent({ payload })).toEqual({
        name: eventNames[event],
        properties: {
          category,
          label: courseId,
          updatedGrades: payload.responseData,
        },
      });
    });
  });

  describe('grade update failure', () => {
    const { event, trigger, handler } = loadEvent(events.updateFailed);
    const payload = { error: 'some Errors happened :-(', other: 'stuff also' };
    test('triggers on actions.grades.update.failure', () => {
      expect(trigger).toEqual(actions.grades.update.failure.toString());
    });
    it('tracks event with error info', () => {
      expect(handler.trackEvent({ payload })).toEqual({
        name: eventNames[event],
        properties: {
          category,
          label: courseId,
          error: payload.error,
        },
      });
    });
  });

  describe('grade override upload failure', () => {
    const { event, trigger, handler } = loadEvent(events.uploadOverrideSucceeded);
    test('triggers on actions.grades.uploadOverride.success', () => {
      expect(trigger).toEqual(actions.grades.uploadOverride.success.toString());
    });
    it('tracks event', () => {
      expect(handler.trackEvent()).toEqual({
        name: eventNames[event],
        properties: {
          category,
          label: courseId,
        },
      });
    });
  });

  describe('grade override upload failure', () => {
    const { event, trigger, handler } = loadEvent(events.uploadOverrideFailed);
    const payload = { error: 'some Errors happened :-(', other: 'stuff also' };
    test('triggers on actions.grades.uploadOverride.failure', () => {
      expect(trigger).toEqual(actions.grades.uploadOverride.failure.toString());
    });
    it('tracks event with error info', () => {
      expect(handler.trackEvent({ payload })).toEqual({
        name: eventNames[event],
        properties: {
          category,
          label: courseId,
          error: payload.error,
        },
      });
    });
  });

  describe('gradebook filter applied', () => {
    const { event, trigger, handler } = loadEvent(events.filterApplied);
    test('triggers on actions.filters.update.courseGradeLimits', () => {
      expect(trigger).toEqual(actions.filters.update.courseGradeLimits.toString());
    });
    it('tracks event with error info', () => {
      expect(handler.trackEvent()).toEqual({
        name: eventNames[event],
        label: courseId,
        properties: {
          category,
          label: courseId,
        },
      });
    });
  });

  describe('bulk grade report downloaded', () => {
    const { event, trigger, handler } = loadEvent(events.gradesReportDownloaded);
    test('triggers on actions.grades.downloadReport.bulkGrades', () => {
      expect(trigger).toEqual(actions.grades.downloadReport.bulkGrades.toString());
    });
    it('tracks event', () => {
      expect(handler.trackEvent()).toEqual({
        name: eventNames[event],
        properties: {
          category,
          label: courseId,
        },
      });
    });
  });

  describe('intervention report downloaded', () => {
    const { event, trigger, handler } = loadEvent(events.interventionReportDownloaded);
    test('triggers on actions.grades.downloadReport.intervention', () => {
      expect(trigger).toEqual(actions.grades.downloadReport.intervention.toString());
    });
    it('tracks event', () => {
      expect(handler.trackEvent()).toEqual({
        name: eventNames[event],
        properties: {
          category,
          label: courseId,
        },
      });
    });
  });
});
