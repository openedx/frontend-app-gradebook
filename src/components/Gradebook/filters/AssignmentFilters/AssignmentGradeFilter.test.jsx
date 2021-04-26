import React from 'react';
import { mount, shallow } from 'enzyme';

import { updateAssignmentLimits } from 'data/actions/filters';
import { fetchGrades } from 'data/actions/grades';

import {
  AssignmentGradeFilter,
  mapStateToProps,
  mapDispatchToProps,
} from './AssignmentGradeFilter';

describe('AssignmentGradeFilter', () => {
  let props = {
    assignmentGradeMin: '1',
    assignmentGradeMax: '100',
    courseId: '12345',

    selectedAssignmentType: 'assgnFilterLabel1',
    selectedAssignment: 'assgN1',
    selectedCohort: 'a cohort',
    selectedTrack: 'a track',
  };

  beforeEach(() => {
    props = {
      ...props,
      setAssignmentGradeMin: jest.fn(),
      setAssignmentGradeMax: jest.fn(),
      updateQueryParams: jest.fn(),
      getUserGrades: jest.fn(),
      updateAssignmentLimits: jest.fn(),
    };
  });

  describe('Component', () => {
    describe('behavior', () => {
      describe('handleSubmit', () => {
        let el;
        let event;
        beforeEach(() => {
          event = { preventDefault: jest.fn() };
          el = mount(<AssignmentGradeFilter {...props} />);
          el.instance().handleSubmit(event);
        });
        it('prevents default event propagation', () => {
          expect(event.preventDefault).toHaveBeenCalled();
        });
        it('calls props.updateAssignmentLimits with min and max', () => {
          expect(props.updateAssignmentLimits).toHaveBeenCalledWith(
            props.assignmentGradeMin,
            props.assignmentGradeMax,
          );
        });
        it('calls getUserGrades w/ selection', () => {
          expect(props.getUserGrades).toHaveBeenCalledWith(
            props.courseId,
            props.selectedCohort,
            props.selectedTrack,
            props.selectedAssignmentType,
          );
        });
        it('updates queryParams with assignment grade min and max', () => {
          expect(props.updateQueryParams).toHaveBeenCalledWith({
            assignmentGradeMin: props.assignmentGradeMin,
            assignmentGradeMax: props.assignmentGradeMax,
          });
        });
      });
    });
    describe('snapshots', () => {
      let el;
      const mockMethods = () => {
        el.instance().handleSubmit = jest.fn().mockName('handleSubmit');
        el.instance().handleSetMax = jest.fn().mockName('handleSetMax');
        el.instance().handleSetMin = jest.fn().mockName('handleSetMin');
      };
      test('smoke test', () => {
        el = shallow(<AssignmentGradeFilter {...props} />);
        mockMethods(el);
        expect(el.instance().render()).toMatchSnapshot();
      });
      test('buttons and groups disabled if no selected assignment', () => {
        el = shallow(<AssignmentGradeFilter
          {...props}
          selectedAssignment={undefined}
        />);
        mockMethods(el);
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
    describe('selectedAsssignment', () => {
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
    test('getUserGrades', () => {
      expect(mapDispatchToProps.getUserGrades).toEqual(
        fetchGrades,
      );
    });
    test('updateAssignmentLimits', () => {
      expect(
        mapDispatchToProps.updateAssignmentLimits,
      ).toEqual(
        updateAssignmentLimits,
      );
    });
  });
});