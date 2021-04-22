import React from 'react';
import PropTypes from 'prop-types';
import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import {
  Assignments,
  mapStateToProps,
  mapDispatchToProps
} from './Assignments';

jest.mock('@edx/paragon', () => ({
  Button: 'Button',
  Collapsible: 'Collapsible',
  Form: 'Form',
}));

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
      { label: 'assgn_type1', subsectionLabel: 'subLabel1' },
      { label: 'assgn_type2', subsectionLabel: 'subLabel2' },
    ],
    filterAssignmentType: jest.fn().mockName('filterAssignmentType'),
    // TODO
    getUserGrades: jest.fn().mockName('getUserGrades').mockReturnValue(),
    selectedAssignmentType: 'assgnFilterLabel1',
    selectedAssignment: 'assgn1',
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
      const methods = [
        "handleAssignmentFilterChange",
        "handleAssignmentTypeFilterChange",
        "handleSubmitAssignmentGrade",
        "handleSetAssignmentGradeMin",
        "handleSetAssignmentGradeMax",
      ];
      let el;
      const mockHandlers = (el) => {
        const mockMethod = 
        methods.map((name) => {
          el.instance()[name] = jest.fn().mockName(name);
          return el.instance()[name];
        });
      };
      test("basic snapshot: allEnabled", () => {
        const el = shallow(<Assignments {...props} />);
        mockHandlers(el);
        expect(el.instance().render()).toMatchSnapshot();
      });

    });
  });
  describe("mapStateToProps", () => {

  });
  describe("mapDispatchToProps", () => {

  });
});
