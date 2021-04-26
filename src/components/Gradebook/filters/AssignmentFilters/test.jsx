/* eslint-disable import/no-named-as-default */

import React from 'react';
import { shallow } from 'enzyme';

import AssignmentFilters from '.';

jest.mock('@edx/paragon', () => ({
  Collapsible: 'Collapsible',
}));

describe('Assignments', () => {
  const props = {
    assignmentGradeMin: '5',
    assignmentGradeMax: '92',
    courseId: '12345',
    setAssignmentGradeMin: jest.fn().mockName('setAssignmentGradeMin'),
    setAssignmentGradeMax: jest.fn().mockName('setAssignmentGradeMax'),
    updateQueryParams: jest.fn().mockName('updateQueryParams'),
  };

  describe('Component', () => {
    describe('snapshots', () => {
      test('basic snapshot', () => {
        const el = shallow(<AssignmentFilters {...props} />);
        expect(el).toMatchSnapshot();
      });
    });
  });
  describe('mapStateToProps', () => {

  });
  describe('mapDispatchToProps', () => {

  });
});
