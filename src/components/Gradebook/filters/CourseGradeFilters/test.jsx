/* eslint-disable import/no-named-as-default */

import React from 'react';
import { shallow } from 'enzyme';

import { updateCourseGradeFilter } from 'data/actions/filters';
import { fetchGrades } from 'data/actions/grades';
import {
  CourseGradeFilters,
  mapStateToProps,
  mapDispatchToProps,
} from '.';

jest.mock('@edx/paragon', () => ({
  Button: 'Button',
  Collapsible: 'Collapsible',
}));

describe('CourseGradeFilters', () => {
  let props = {
    courseGradeMin: '5',
    courseGradeMax: '92',
    courseId: '12345',
    selectedAssignmentType: 'assignMent type 1',
    selectedCohort: 'COHort',
    selectedTrack: 'TracK',
  };

  beforeEach(() => {
    props = {
      ...props,
      getUserGrades: jest.fn(),
      setCourseGradeMin: jest.fn(),
      setCourseGradeMax: jest.fn(),
      setIsMinCourseGradeFilterValid: jest.fn(),
      setIsMaxCourseGradeFilterValid: jest.fn(),
      updateQueryParams: jest.fn(),
      updateFilter: jest.fn(),
    };
  });

  describe('Component', () => {
    describe('snapshots', () => {
      test('basic snapshot', () => {
        const el = shallow(<CourseGradeFilters {...props} />);
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
        el = shallow(<CourseGradeFilters {...props} />);
      });
      describe('handleApplyClick', () => {
      });
      describe('updateAPI', () => {
        beforeEach(() => {
          el.instance().updateAPI();
        });
        it('calls props.updateFilter with selection', () => {
          expect(props.updateFilter).toHaveBeenCalledWith(
            props.courseGradeMin,
            props.courseGradeMax,
            props.courseId,
          );
        });
        it('calls props.getUserGrades with selection', () => {
          expect(props.getUserGrades).toHaveBeenCalledWith(
            props.courseId,
            props.selectedCohort,
            props.selectedTrack,
            props.selectedAssignmentType,
            {
              courseGradeMin: props.courseGradeMin,
              courseGradeMax: props.courseGradeMax,
            },
          );
        });
        it('updates query params with courseGradeMin and courseGradeMax', () => {
          expect(props.updateQueryParams).toHaveBeenCalledWith({
            courseGradeMin: props.courseGradeMin,
            courseGradeMax: props.courseGradeMax,
          });
        });
      });
      describe('handleUpdateMin', () => {
        it('calls props.setCourseGradeMin with event value', () => {
          el.instance().handleUpdateMin(
            { target: { value: testVal } },
          );
          expect(props.setCourseGradeMin).toHaveBeenCalledWith(testVal);
        });
      });
      describe('handleUpdateMax', () => {
        it('calls props.setCourseGradeMax with event value', () => {
          el.instance().handleUpdateMax(
            { target: { value: testVal } },
          );
          expect(props.setCourseGradeMax).toHaveBeenCalledWith(testVal);
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
        expect(mapDispatchToProps.updateFilter).toEqual(updateCourseGradeFilter);
      });
    });
    describe('getUserGrades', () => {
      test('from fetchGrades', () => {
        expect(mapDispatchToProps.getUserGrades).toEqual(fetchGrades);
      });
    });
  });
});
