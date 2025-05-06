import React from 'react';
import { render, screen } from '@testing-library/react';

import useStatusAlertsData from './hooks';
import StatusAlerts from '.';

jest.mock('./hooks', () => jest.fn());

const hookProps = {
  successBanner: {
    onClose: jest.fn().mockName('hooks.successBanner.onClose'),
    show: true,
    text: 'hooks.success-banner-text',
  },
  gradeFilter: {
    show: true,
    text: 'hooks.grade-filter-text',
  },
  courseGradeFilter: {
    show: 'hooks.show-grade-filter',
    text: 'hooks.grade-filter-text',
  },
  assignmentGradeFilter: {
    show: 'hooks.show-grade-filter',
    text: 'hooks.grade-filter-text',
  },
};
useStatusAlertsData.mockReturnValue(hookProps);

describe('StatusAlerts component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    render(<StatusAlerts />);
  });
  describe('behavior', () => {
    it('initializes component hooks', () => {
      expect(useStatusAlertsData).toHaveBeenCalled();
    });
  });
  describe('render', () => {
    it('success banner', () => {
      const alerts = screen.getAllByRole('alert');
      const successAlert = alerts[0];
      expect(successAlert).toHaveTextContent(hookProps.successBanner.text);
      expect(successAlert).toHaveClass('alert-success');
    });
    it('grade filter banner', () => {
      const alerts = screen.getAllByRole('alert');
      const gradeFilter = alerts[1];
      expect(gradeFilter).toHaveTextContent(hookProps.gradeFilter.text);
      expect(gradeFilter).toHaveClass('alert-danger');
    });
    test('course and assignment filter banner', () => {
      const alert = el.find(Alert).at(1);
      const props = alert.props();
      expect(props.show).toEqual(hookProps.courseGradeFilter.show);
      expect(alert.text()).toEqual(hookProps.courseGradeFilter.text);
      expect(props.show).toEqual(hookProps.assignmentGradeFilter.show);
      expect(alert.text()).toEqual(hookProps.assignmentGradeFilter.text);
    });
  });
});
