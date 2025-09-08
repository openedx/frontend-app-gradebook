import React from 'react';
import { screen } from '@testing-library/react';

import useCourseGradeFilterData from './hooks';
import CourseFilter from '.';
import { renderWithIntl } from '../../../testUtilsExtra';

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

describe('CourseFilter component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('render', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    describe('with selected assignment', () => {
      beforeEach(() => {
        renderWithIntl(<CourseFilter updateQueryParams={updateQueryParams} />);
      });

      it('renders a PercentGroup for both Max and Min filters', () => {
        expect(screen.getByRole('spinbutton', { name: 'Min Grade' })).toHaveValue(hookData.min.value);
        expect(screen.getByRole('spinbutton', { name: 'Max Grade' })).toHaveValue(hookData.max.value);
      });
      it('renders a submit button', () => {
        expect(screen.getByRole('button', { name: 'Apply' })).toBeInTheDocument();
        // Expect it to be enabled
        expect(screen.getByRole('button', { name: 'Apply' })).not.toBeDisabled();
      });
    });
    describe('if disabled', () => {
      beforeEach(() => {
        jest.clearAllMocks();
        useCourseGradeFilterData.mockReturnValueOnce({ ...hookData, isDisabled: true });
        renderWithIntl(<CourseFilter updateQueryParams={updateQueryParams} />);
      });
      it('disables submit', () => {
        expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled();
      });
    });
  });
});
