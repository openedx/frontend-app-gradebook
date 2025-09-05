import React from 'react';
import { render, screen } from '@testing-library/react';

import useStatusAlertsData from './hooks';
import StatusAlerts from '.';

jest.mock('./hooks', () => jest.fn());
jest.unmock('@openedx/paragon');

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
  });
});
