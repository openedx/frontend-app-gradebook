import actions, { dataKey } from './filters';
import initialFilters from '../constants/filters';
import { testAction, testActionTypes } from './testUtils';

describe('actions.filters', () => {
  describe('action types', () => {
    const actionTypes = [
      actions.initialize,
      actions.reset,
      actions.update.assignment,
      actions.update.assignmentType,
      actions.update.assignmentLimits,
      actions.update.courseGradeLimits,
      actions.update.includeCourseRoleMembers,
      actions.update.cohort,
      actions.update.track,
    ].map(action => action.toString());
    testActionTypes(actionTypes, dataKey);
  });
  describe('actions provided', () => {
    describe('initialize action', () => {
      it('sets initialFilters values for missing args', () => {
        testAction(actions.initialize, {}, {
          assignment: { id: initialFilters.assignment },
          assignmentType: initialFilters.assignmentType,
          cohort: initialFilters.cohort,
          track: initialFilters.track,
          assignmentGradeMin: initialFilters.assignmentGradeMin,
          assignmentGradeMax: initialFilters.assignmentGradeMax,
          courseGradeMin: initialFilters.courseGradeMin,
          courseGradeMax: initialFilters.courseGradeMax,
          includeCourseRoleMembers: initialFilters.includeCourseRoleMembers,
        });
      });
      it('loads filters from args', () => {
        const expected = {
          assignment: { id: 'assIGNmentId' },
          assignmentType: 'aType',
          track: 'masters',
          cohort: 3,
          assignmentGradeMin: 23,
          assignmentGradeMax: 98,
          courseGradeMin: 11,
          courseGradeMax: 87,
          includeCourseRoleMembers: true,
        };
        const args = { ...expected, assignment: expected.assignment.id, also: 'other stuff' };
        testAction(actions.initialize, args, expected);
      });
    });
    test('reset action', () => testAction(actions.reset));
    describe('update actions', () => {
      test('update.assignment action', () => (
        testAction(actions.update.assignment)
      ));
      test('update.assignmentType action', () => (
        testAction(actions.update.assignmentType)
      ));
      test('update.assignmentLimits action', () => (
        testAction(actions.update.assignmentLimits)
      ));
      test('update.courseGradeLimits action', () => (
        testAction(actions.update.courseGradeLimits)
      ));
      test('update.includeCourseRoleMembers action', () => (
        testAction(actions.update.includeCourseRoleMembers)
      ));
      test('update.cohort action', () => (
        testAction(actions.update.cohort)
      ));
      test('update.track action', () => (
        testAction(actions.update.track)
      ));
    });
  });
});
