import React from 'react';
import { mount, shallow } from 'enzyme';

import { updateAssignmentFilter } from 'data/actions/filters';
import { updateGradesIfAssignmentGradeFiltersSet } from 'data/actions/grades';
import {
  AssignmentFilter,
  mapStateToProps,
  mapDispatchToProps,
} from '.';

jest.mock('data/selectors/filters', () => ({
  /** Mocking to use passed state for validation purposes */
  selectableAssignmentLabels: jest.fn().mockImplementation((state) => ({
    state,
    selectableLabels: 'selectableLabels',
  })),
}));

describe('AssignmentFilter', () => {
  let props = {
    courseId: '12345',
    assignmentFilterOptions: [
      {
        label: 'assgN1',
        subsectionLabel: 'subLabel1',
        type: 'assgn_Type1',
        id: 'assgn_iD1',
      },
      {
        label: 'assgN2',
        subsectionLabel: 'subLabel2',
        type: 'assgn_Type2',
        id: 'assgn_iD2',
      },
    ],
    selectedAssignmentType: 'assgnFilterLabel1',
    selectedAssignment: 'assgN1',
    selectedCohort: 'a cohort',
    selectedTrack: 'a track',
  };

  beforeEach(() => {
    props = {
      ...props,
      updateQueryParams: jest.fn(),
      updateGradesIfAssignmentGradeFiltersSet: jest.fn(),
      updateAssignmentFilter: jest.fn(),
    };
  });

  describe('Component', () => {
    describe('behavior', () => {
      describe('handleChange', () => {
        let el;
        const newAssgn = 'assgN1';
        const event = { target: { value: newAssgn } };
        const selected = props.assignmentFilterOptions[0];
        beforeEach(() => {
          el = mount(<AssignmentFilter {...props} />);
          el.instance().handleChange(event);
        });

        it('calls props.updateAssignmentFilter with selection', () => {
          expect(props.updateAssignmentFilter).toHaveBeenCalledWith({
            label: newAssgn,
            type: selected.type,
            id: selected.id,
          });
        });
        it('calls props.updateQueryParams with selected assignment id',
          () => {
            expect(props.updateQueryParams).toHaveBeenCalledWith({
              assignment: selected.id,
            });
          });
        it('calls props.updateGradesIfAssignmentGradeFiltersSet', () => {
          const method = props.updateGradesIfAssignmentGradeFiltersSet;
          expect(method).toHaveBeenCalledWith(
            props.courseId,
            props.selectedCohort,
            props.selectedTrack,
            props.selectedAssignmentType,
          );
        });
      });
    });
    describe('snapshots', () => {
      test('basic snapshot', () => {
        const el = shallow(<AssignmentFilter {...props} />);
        el.instance().handleChange = jest.fn().mockName('handleChange');
        expect(el.instance().render()).toMatchSnapshot();
      });
    });
  });
  describe('mapStateToProps', () => {
    const state = {
      filters: {
        assignment: { label: 'assigNment' },
        assignmentType: 'assignMentType',
        cohort: 'COhort',
        track: 'traCK',
      },
    };
    describe('assignmentFilterOptions', () => {
      it('is drawn from selectableAssignmentLabels', () => {
        expect(mapStateToProps(state).assignmentFilterOptions).toEqual({
          state,
          selectableLabels: 'selectableLabels',
        });
      });
    });
    describe('selectedAssignment', () => {
      it('is undefined if no assignment is passed', () => {
        expect(
          mapStateToProps({ filters: {} }).selectedAssignment,
        ).toEqual(undefined);
      });
      it('returns the label of selected assignment if there is one', () => {
        expect(
          mapStateToProps(state).selectedAssignment,
        ).toEqual(
          state.filters.assignment.label,
        );
      });
    });
    describe('selectedAssignmentType', () => {
      it('is drawn from state.filters.assignmentType', () => {
        expect(
          mapStateToProps(state).selectedAssignmentType,
        ).toEqual(
          state.filters.assignmentType,
        );
      });
    });
    describe('selectedCohort', () => {
      it('is drawn from state.filters.cohort', () => {
        expect(
          mapStateToProps(state).selectedCohort,
        ).toEqual(
          state.filters.cohort,
        );
      });
    });
    describe('selectedTrack', () => {
      it('is drawn from state.filters.track', () => {
        expect(
          mapStateToProps(state).selectedTrack,
        ).toEqual(
          state.filters.track,
        );
      });
    });
  });
  describe('mapDispatchToProps', () => {
    test('updateAssignmentFilter', () => {
      expect(mapDispatchToProps.updateAssignmentFilter).toEqual(
        updateAssignmentFilter,
      );
    });
    test('updateGradesIfAsssignmentGradeFiltersSet', () => {
      const prop = mapDispatchToProps.updateGradesIfAssignmentGradeFiltersSet;
      expect(prop).toEqual(updateGradesIfAssignmentGradeFiltersSet);
    });
  });
});
