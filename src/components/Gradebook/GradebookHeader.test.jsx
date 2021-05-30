import React from 'react';
import { shallow } from 'enzyme';

import selectors from 'data/selectors';
import { GradebookHeader, mapStateToProps } from './GradebookHeader';

jest.mock('data/selectors', () => ({
  __esModule: true,
  default: {
    app: { courseId: jest.fn(state => ({ courseId: state })) },
    assignmentTypes: { areGradesFrozen: jest.fn(state => ({ areGradesFrozen: state })) },
    roles: { canUserViewGradebook: jest.fn(state => ({ canUserViewGradebook: state })) },
  },
}));

const courseId = 'fakeID';
describe('GradebookHeader component', () => {
  describe('snapshots', () => {
    describe('default values (grades frozen, cannot view).', () => {
      test('unauthorized warning, but no grades frozen warning', () => {
        const props = { courseId, areGradesFrozen: false, canUserViewGradebook: false };
        expect(shallow(<GradebookHeader {...props} />)).toMatchSnapshot();
      });
    });
    describe('grades frozen, cannot view', () => {
      test('unauthorized warning, and grades frozen warning.', () => {
        const props = { courseId, areGradesFrozen: true, canUserViewGradebook: false };
        expect(shallow(<GradebookHeader {...props} />)).toMatchSnapshot();
      });
    });
    describe('grades frozen, can view.', () => {
      test('grades frozen warning but no unauthorized warning', () => {
        const props = { courseId, areGradesFrozen: true, canUserViewGradebook: true };
        expect(shallow(<GradebookHeader {...props} />)).toMatchSnapshot();
      });
    });
  });
  describe('mapStateToProps', () => {
    let mapped;
    const testState = { a: 'test', example: 'state' };
    beforeEach(() => {
      mapped = mapStateToProps(testState);
    });
    test('courseId from app.courseId', () => {
      expect(mapped.courseId).toEqual(selectors.app.courseId(testState));
    });
    test('areGradesFrozen from assignmentTypes selector', () => {
      expect(
        mapped.areGradesFrozen,
      ).toEqual(selectors.assignmentTypes.areGradesFrozen(testState));
    });
    test('canUserViewGradebook from roles selector', () => {
      expect(
        mapped.canUserViewGradebook,
      ).toEqual(selectors.roles.canUserViewGradebook(testState));
    });
  });
});
