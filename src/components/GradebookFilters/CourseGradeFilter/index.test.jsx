import React from 'react';
import { shallow } from '@edx/react-unit-test-utils';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Button } from '@openedx/paragon';

import PercentGroup from '../PercentGroup';
import useCourseGradeFilterData from './hooks';
import CourseFilter from '.';

jest.mock('../PercentGroup', () => 'PercentGroup');
jest.mock('./hooks', () => ({ __esModule: true, default: jest.fn() }));

const hookData = {
  handleChange: jest.fn(),
  max: {
    value: 300,
    onChange: jest.fn(),
  },
  min: {
    value: 23,
    onChange: jest.fn(),
  },
  selectedCourse: 'test-assignment',
  isDisabled: false,
};
useCourseGradeFilterData.mockReturnValue(hookData);

const updateQueryParams = jest.fn();

let el;
describe('CourseFilter component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    el = shallow(<CourseFilter updateQueryParams={updateQueryParams} />);
  });
  describe('behavior', () => {
    it('initializes hooks', () => {
      expect(useCourseGradeFilterData).toHaveBeenCalledWith({ updateQueryParams });
      expect(useIntl).toHaveBeenCalledWith();
    });
  });
  describe('render', () => {
    describe('with selected assignment', () => {
      test('snapshot', () => {
        expect(el.snapshot).toMatchSnapshot();
      });
      it('renders a PercentGroup for both Max and Min filters', () => {
        let { props } = el.instance.findByType(PercentGroup)[0];
        expect(props.value).toEqual(hookData.min.value);
        expect(props.onChange).toEqual(hookData.min.onChange);
        props = el.instance.findByType(PercentGroup)[1].props;
        expect(props.value).toEqual(hookData.max.value);
        expect(props.onChange).toEqual(hookData.max.onChange);
      });
      it('renders a submit button', () => {
        const { props } = el.instance.findByType(Button)[0];
        expect(props.disabled).toEqual(false);
        expect(props.onClick).toEqual(hookData.handleApplyClick);
      });
    });
    describe('if disabled', () => {
      beforeEach(() => {
        useCourseGradeFilterData.mockReturnValueOnce({ ...hookData, isDisabled: true });
        el = shallow(<CourseFilter updateQueryParams={updateQueryParams} />);
      });
      test('snapshot', () => {
        expect(el.snapshot).toMatchSnapshot();
      });
      it('disables submit', () => {
        const { props } = el.instance.findByType(Button)[0];
        expect(props.disabled).toEqual(true);
      });
    });
  });
});
