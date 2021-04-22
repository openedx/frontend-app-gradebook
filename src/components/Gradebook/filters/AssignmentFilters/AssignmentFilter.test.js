import React from 'react';
import PropTypes from 'prop-types';
import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import {
  AssignmentFilter,
  mapStateToProps,
  mapDispatchToProps
} from './AssignmentFilter';

describe("AssignmentFilter", () => {
  const props = {
    courseId: '12345',
    updateQueryParams: jest.fn().mockName("updateQueryParams"),

    assignmentFilterOptions: [
      { label: 'assgn_type1', subsectionLabel: 'subLabel1' },
      { label: 'assgn_type2', subsectionLabel: 'subLabel2' },
    ],
    selectedAssignmentType: 'assgnFilterLabel1',
    selectedAssignment: 'assgn1',
    selectedCohort: 'a cohort',
    selectedTrack: 'a track',
    updateGradesIfAssignmentGradeFiltersSet: jest.fn().mockName(
      'updateGradesIfAssignmentGradeFiltersSet',
    ),
    updateAssignmentFilter: jest.fn().mockName('updateAssignmentFilter'),
  };

  describe("Component", () => {
    describe("snapshots", () => {
      test("basic snapshot", () => {
        const el = shallow(<AssignmentFilter {...props} />);
        el.instance().handleChange = jest.fn().mockName('handleChange');
        expect(el.instance().render()).toMatchSnapshot();
      });
    });
  });
  describe("mapStateToProps", () => {

  });
  describe("mapDispatchToProps", () => {

  });
});
