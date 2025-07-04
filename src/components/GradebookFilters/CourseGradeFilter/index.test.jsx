import React from 'react';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import useCourseGradeFilterData from './hooks';
import CourseFilter from '.';

jest.unmock('@openedx/paragon');
jest.unmock('react');
jest.unmock('@edx/frontend-platform/i18n');

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
        render(<IntlProvider locale="en"><CourseFilter updateQueryParams={updateQueryParams} /></IntlProvider>);
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
        render(<IntlProvider locale="en"><CourseFilter updateQueryParams={updateQueryParams} /></IntlProvider>);
      });
      it('disables submit', () => {
        expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled();
      });
    });
  });
});
