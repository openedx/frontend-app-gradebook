/* eslint-disable import/no-named-as-default */

import React from 'react';
import { shallow } from 'enzyme';

import actions from 'data/actions';
import selectors from 'data/selectors';
import { fetchGrades } from 'data/thunkActions/grades';
import {
  CourseGradeFilter,
  mapStateToProps,
  mapDispatchToProps,
} from '.';

jest.mock('@edx/paragon', () => ({
  Button: () => 'Button',
}));
jest.mock('../PercentGroup', () => 'PercentGroup');

jest.mock('data/thunkActions/grades', () => ({
  fetchGrades: jest.fn(),
}));

jest.mock('data/selectors', () => ({
  __esModule: true,
  default: {
    app: {
      areCourseGradeFiltersValid: jest.fn(state => ({ areCourseGradeFiltersValid: state })),
      courseGradeLimits: jest.fn(state => ({ courseGradeLimits: state })),
    },
  },
}));

describe('CourseGradeFilter', () => {
  let props = {
    localCourseLimits: {
      courseGradeMin: '5',
      courseGradeMax: '92',
    },
    areLimitsValid: true,
  };

  beforeEach(() => {
    props = {
      ...props,
      fetchGrades: jest.fn(),
      setLocalFilter: jest.fn(),
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
        it('calls updateCourseGradeFilters is limits are valid', () => {
          el.instance().handleApplyClick();
          expect(el.instance().updateCourseGradeFilters).toHaveBeenCalledWith();
        });
        it('does not call updateCourseGradeFilters if limits are not valid', () => {
          el.setProps({ areLimitsValid: false });
          el.instance().handleApplyClick();
          expect(el.instance().updateCourseGradeFilters).not.toHaveBeenCalled();
        });
      });
      describe('updateCourseGradeFilters', () => {
        beforeEach(() => {
          el.instance().updateCourseGradeFilters();
        });
        it('calls props.updateFilter with selection', () => {
          expect(props.updateFilter).toHaveBeenCalledWith(props.localCourseLimits);
        });
        it('calls props.getUserGrades with selection', () => {
          expect(props.fetchGrades).toHaveBeenCalledWith();
        });
        it('updates query params with courseGradeMin and courseGradeMax', () => {
          expect(props.updateQueryParams).toHaveBeenCalledWith(props.localCourseLimits);
        });
      });
      describe('handleUpdateMin', () => {
        it('calls props.setCourseGradeMin with event value', () => {
          el.instance().handleUpdateMin(
            { target: { value: testVal } },
          );
          expect(props.setLocalFilter).toHaveBeenCalledWith({
            courseGradeMin: testVal,
          });
        });
      });
      describe('handleUpdateMax', () => {
        it('calls props.setCourseGradeMax with event value', () => {
          el.instance().handleUpdateMax(
            { target: { value: testVal } },
          );
          expect(props.setLocalFilter).toHaveBeenCalledWith({
            courseGradeMax: testVal,
          });
        });
      });
    });
  });
  describe('mapStateToProps', () => {
    const testState = { peanut: 'butter', jelly: 'time' };
    let mapped;
    beforeEach(() => {
      mapped = mapStateToProps(testState);
    });
    test('areLimitsValid from app.areCourseGradeFiltersValid', () => {
      expect(mapped.areLimitsValid).toEqual(selectors.app.areCourseGradeFiltersValid(testState));
    });
    test('localCourseLimits from app.courseGradeLimits', () => {
      expect(mapped.localCourseLimits).toEqual(selectors.app.courseGradeLimits(testState));
    });
  });
  describe('mapDispatchToProps', () => {
    test('fetchGrades from thunkActions.grades.fetchGrades', () => {
      expect(mapDispatchToProps.fetchGrades).toEqual(fetchGrades);
    });
    test('setLocalFilter from actions.app.setLocalFilter', () => {
      expect(mapDispatchToProps.setLocalFilter).toEqual(actions.app.setLocalFilter);
    });
    test('updateFilter from actions.filters.update.courseGradeLimits', () => {
      expect(mapDispatchToProps.updateFilter).toEqual(actions.filters.update.courseGradeLimits);
    });
  });
});
