import React from 'react';
import PropTypes from 'prop-types';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import {
  Assignments,
  mapStateToProps,
  mapDispatchToProps
} from './Assignments';

describe("Assignments", () => {

  const props = {
    assignmentGradeMin: '0',
    assignmentGradeMax: '100',
    courseId: '12345',
    setAssignmentGradeMin: jest.fn().mockName("setAssignmentGradeMin"),
    setAssignmentGradeMax: jest.fn().mockName("setAssignmentGradeMax"),
    updateQueryParams: jest.fn().mockName("updateQueryParams"),

    assignmentTypes: ['assgn1', 'assgn2', 'assgn3'],
    assignmentFilterOptions: [
      { label: 'assgnFilterLabel1', subsectionLabel: 'assgnFilterSubLabel1' },
      { label: 'assgnFilterLabel2', subsectionLabel: 'assgnFilterSubLabel2' },
    ],
    filterAssignmentType: jest.fn().mockName('filterAssignmentType'),
    getUserGrades: jest.fn().mockName('getUserGrades').mockReturnValue( /** TODO */),
    selectedAssignmentType: 'assgn1',
    selectedAssignment: 'first assignment',
    selectedCohort: 'a cohort',
    selectedTrack: 'a track',
    updateGradesIfAssignmentGradeFiltersSet: jest.fn().mockName(
      'updateGradesIfAssignmentGradeFiltersSet',
    ),
    updateAssignmentFilter: jest.fn().mockName('updateAssignmentFilter'),
    updateAssignmentLimits: jest.fn().mockName('updateAssignmentLimits'),
  };

  describe("Component", () => {
    describe("snapshots", () => {
      it("renders", () => {
        expect(shallow(<Assignments {...props} />)).toMatchSnapshot();
      });
    });

  });
  describe("mapStateToProps", () => {

  });
  describe("mapDispatchToProps", () => {

  });
});
