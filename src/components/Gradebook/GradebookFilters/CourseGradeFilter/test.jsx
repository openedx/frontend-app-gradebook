/* eslint-disable import/no-named-as-default */

import React from 'react';
import { shallow } from 'enzyme';

import actions from 'data/actions';
import { fetchGrades } from 'data/thunkActions/grades';
import {
  CourseGradeFilter,
  mapStateToProps,
  mapDispatchToProps,
} from '.';

jest.mock('@edx/paragon', () => ({
  Button: 'Button',
  Collapsible: 'Collapsible',
}));

describe('CourseGradeFilter', () => {
  let props = {
    filterValues: {
      courseGradeMin: '5',
      courseGradeMax: '92',
    },
    courseId: '12345',
    selectedAssignmentType: 'assignMent type 1',
    selectedCohort: 'COHort',
    selectedTrack: 'TracK',
  };

  beforeEach(() => {
    props = {
      ...props,
      getUserGrades: jest.fn(),
      setFilters: jest.fn(),
      updateQueryParams: jest.fn(),
      updateFilter: jest.fn(),
    };
  });

  describe('Component', () => {
    describe('snapshots', () => {
      test('basic snapshot', () => {
        const el = shallow(<CourseGradeFilter {...props} />);
        el.instance().handleUpdateMin = jest.fn().mockName(
          'handleUpdateMin',
        );
        el.instance().handleUpdateMax = jest.fn().mockName(
          'handleUpdateMax',
        );
        el.instance().handleApplyClick = jest.fn().mockName(
          'handleApplyClick',
        );
        expect(el.instance().render()).toMatchSnapshot();
      });
    });

    describe('behavior', () => {
      let el;
      const testVal = 'TESTvalue';
      beforeEach(() => {
        el = shallow(<CourseGradeFilter {...props} />);
      });
      describe('handleApplyClick', () => {
        beforeEach(() => {
          el.instance().updateCourseGradeFilters = jest.fn();
        });
        it('calls setFilters for isMin(Max)CourseGradeFilterValid', () => {
          el.instance().isGradeFilterValueInRange = jest.fn().mockImplementation(v => v >= 50);
          el.instance().handleApplyClick();
          expect(props.setFilters).toHaveBeenCalledWith({
            isMinCourseGradeFilterValid: false,
            isMaxCourseGradeFilterValid: true,
          });
        });
        it('calls updateCourseGradeFilters only if both min and max are valid', () => {
          const isValid = jest.fn().mockImplementation(v => v >= 50);
          el.instance().isGradeFilterValueInRange = isValid;
          el.instance().handleApplyClick();
          expect(el.instance().updateCourseGradeFilters).not.toHaveBeenCalled();
          isValid.mockImplementation(v => v <= 50);
          el.instance().handleApplyClick();
          expect(el.instance().updateCourseGradeFilters).not.toHaveBeenCalled();
          isValid.mockImplementation(v => v >= 0);
          el.instance().handleApplyClick();
          expect(el.instance().updateCourseGradeFilters).toHaveBeenCalled();
        });
      });
      describe('updateCourseGradeFilters', () => {
        beforeEach(() => {
          el.instance().updateCourseGradeFilters();
        });
        it('calls props.updateFilter with selection', () => {
          expect(props.updateFilter).toHaveBeenCalledWith({
            courseGradeMin: props.filterValues.courseGradeMin,
            courseGradeMax: props.filterValues.courseGradeMax,
            courseId: props.courseId,
          });
        });
        it('calls props.getUserGrades with selection', () => {
          expect(props.getUserGrades).toHaveBeenCalledWith(
            props.courseId,
            props.selectedCohort,
            props.selectedTrack,
            props.selectedAssignmentType,
            {
              courseGradeMin: props.filterValues.courseGradeMin,
              courseGradeMax: props.filterValues.courseGradeMax,
            },
          );
        });
        it('updates query params with courseGradeMin and courseGradeMax', () => {
          expect(props.updateQueryParams).toHaveBeenCalledWith({
            courseGradeMin: props.filterValues.courseGradeMin,
            courseGradeMax: props.filterValues.courseGradeMax,
          });
        });
      });
      describe('handleUpdateMin', () => {
        it('calls props.setCourseGradeMin with event value', () => {
          el.instance().handleUpdateMin(
            { target: { value: testVal } },
          );
          expect(props.setFilters).toHaveBeenCalledWith({
            courseGradeMin: testVal,
          });
        });
      });
      describe('handleUpdateMax', () => {
        it('calls props.setCourseGradeMax with event value', () => {
          el.instance().handleUpdateMax(
            { target: { value: testVal } },
          );
          expect(props.setFilters).toHaveBeenCalledWith({
            courseGradeMax: testVal,
          });
        });
      });
      describe('isFilterValueInRange', () => {
        it('returns true for values between 0 and 100', () => {
          expect(el.instance().isGradeFilterValueInRange('0')).toEqual(true);
          expect(el.instance().isGradeFilterValueInRange(1.1)).toEqual(true);
          expect(el.instance().isGradeFilterValueInRange('43')).toEqual(true);
          expect(el.instance().isGradeFilterValueInRange(98.6)).toEqual(true);
          expect(el.instance().isGradeFilterValueInRange(100)).toEqual(true);
        });
        it('returns false for values below 0 and above 100', () => {
          expect(el.instance().isGradeFilterValueInRange(-1)).toEqual(false);
          expect(el.instance().isGradeFilterValueInRange(101)).toEqual(false);
        });
      });
    });
  });
  describe('mapStateToProps', () => {
    const state = {
      filters: {
        cohort: 'COHort',
        track: 'TRacK',
        assignmentType: 'TYPe',
      },
    };
    describe('selectedAssignmentType', () => {
      test('drawn from filters.assignmentType', () => {
        expect(mapStateToProps(state).selectedAssignmentType).toEqual(
          state.filters.assignmentType,
        );
      });
    });
    describe('selectedCohort', () => {
      test('drawn from filters.cohort', () => {
        expect(mapStateToProps(state).selectedCohort).toEqual(
          state.filters.cohort,
        );
      });
    });
    describe('selectedTrack', () => {
      test('drawn from filters.track', () => {
        expect(mapStateToProps(state).selectedTrack).toEqual(
          state.filters.track,
        );
      });
    });
  });
  describe('mapDispatchToProps', () => {
    describe('updateFilter', () => {
      test('from updateCourseGradeFilter', () => {
        expect(mapDispatchToProps.updateFilter).toEqual(actions.filters.update.courseGradeLimits);
      });
    });
    describe('getUserGrades', () => {
      test('from fetchGrades', () => {
        expect(mapDispatchToProps.getUserGrades).toEqual(fetchGrades);
      });
    });
  });
});
