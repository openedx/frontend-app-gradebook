import React from 'react';
import { shallow } from '@edx/react-unit-test-utils';

import { Alert } from '@edx/paragon';

import useStatusAlertsData from './hooks';
import StatusAlerts from '.';

jest.mock('./hooks', () => jest.fn());

const hookProps = {
  successBanner: {
    onClose: jest.fn().mockName('hooks.successBanner.onClose'),
    show: 'hooks.show-success-banner',
    text: 'hooks.success-banner-text',
  },
  gradeFilter: {
    show: 'hooks.show-grade-filter',
    text: 'hooks.grade-filter-text',
  },
};
useStatusAlertsData.mockReturnValue(hookProps);

let el;
describe('StatusAlerts component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    el = shallow(<StatusAlerts />);
  });
  describe('behavior', () => {
    it('initializes component hooks', () => {
      expect(useStatusAlertsData).toHaveBeenCalled();
    });
  });
  describe('render', () => {
    test('snapshot', () => {
      expect(el.snapshot).toMatchSnapshot();
    });
    test('success banner', () => {
      const alert = el.instance.findByType(Alert)[0];
      const { props } = alert;
      expect(props.onClose).toEqual(hookProps.successBanner.onClose);
      expect(props.show).toEqual(hookProps.successBanner.show);
      expect(alert.children[0].el).toEqual(hookProps.successBanner.text);
    });
    test('grade filter banner', () => {
      const alert = el.instance.findByType(Alert)[1];
      const { props } = alert;
      expect(props.show).toEqual(hookProps.gradeFilter.show);
      expect(alert.children[0].el).toEqual(hookProps.gradeFilter.text);
    });
  });
});
